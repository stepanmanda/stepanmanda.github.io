import { chromium } from 'playwright';

const BASE = 'https://stepanmanda.github.io';

const pages = [
    '/', '/firmy', '/jednotlivci', '/diagnostika',
    '/o-nas', '/pristup', '/pripadove-studie',
    '/kontakt', '/impresum', '/ochrana-osobnich-udaju',
];

const assets = [
    '/favicon.svg',
    '/apple-touch-icon.svg',
    '/og-image.png',
    '/robots.txt',
    '/sitemap-index.xml',
    '/scripts/main.js',
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

console.log('\n🔍 LIVE CHECK — ' + BASE);
console.log('═'.repeat(60));

console.log('\n📄 STRÁNKY');
for (const path of pages) {
    const response = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    const status = response?.status() ?? 'ERR';
    const title = status === 200 ? (await page.title()).substring(0, 50) : '—';
    const mark = status === 200 ? '✓' : '✗';
    console.log(`  ${mark}  ${String(status).padStart(3)} ${path.padEnd(28)} ${title}`);
}

console.log('\n📦 ASSETS');
for (const path of assets) {
    const response = await page.goto(`${BASE}${path}`).catch(() => null);
    const status = response?.status() ?? 'ERR';
    const mark = status === 200 ? '✓' : '✗';
    console.log(`  ${mark}  ${String(status).padStart(3)} ${path}`);
}

console.log('\n🏷️  META (rozcestník)');
await page.goto(BASE, { waitUntil: 'networkidle' });
const meta = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    favicon: document.querySelector('link[rel="icon"]')?.href,
    themeColor: document.querySelector('meta[name="theme-color"]')?.content,
}));
Object.entries(meta).forEach(([k, v]) => {
    console.log(`  ${v ? '✓' : '✗'}  ${k.padEnd(12)} ${(v || '—').substring(0, 70)}`);
});

console.log('\n🤖 ELEVENLABS WIDGET');
await page.waitForTimeout(4000);
const widget = await page.evaluate(() => {
    const el = document.querySelector('elevenlabs-convai');
    if (!el) return { found: false };
    const compact = el.shadowRoot?.querySelector('[class*="compact-sheet"]');
    const compactVisible = compact ? parseFloat(getComputedStyle(compact).opacity) > 0.5 : false;
    const sheet = el.shadowRoot?.querySelector('.sheet');
    const sheetHidden = !sheet || getComputedStyle(sheet).opacity === '0';
    return {
        found: true,
        agentId: el.getAttribute('agent-id'),
        shadowDom: !!el.shadowRoot,
        compactVisible,
        sheetHidden,
    };
});
Object.entries(widget).forEach(([k, v]) => {
    console.log(`  ${v !== false ? '✓' : '✗'}  ${k.padEnd(14)} ${v}`);
});

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/velyos-github-pages.png' });
console.log('\n📸 SCREENSHOT: /tmp/velyos-github-pages.png');

await browser.close();
console.log('\n' + '═'.repeat(60));
console.log('🚀 Web je live: ' + BASE);
