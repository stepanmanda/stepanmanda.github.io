import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e)));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });

// Test 1: CZ rozcestník → EN → DE → CS (round trip)
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

await page.locator('.lang-switcher .lang-switcher__pill', { hasText: 'EN' }).first().click();
await page.waitForTimeout(1000);
console.log('Step 1: CZ home → EN click →', page.url());

await page.locator('.lang-switcher .lang-switcher__pill', { hasText: 'DE' }).first().click();
await page.waitForTimeout(1000);
console.log('Step 2: EN home → DE click →', page.url());

await page.locator('.lang-switcher .lang-switcher__pill', { hasText: 'CS' }).first().click();
await page.waitForTimeout(1000);
console.log('Step 3: DE home → CS click →', page.url());

// Test 2: z /firmy na EN
await page.goto('http://localhost:4321/firmy', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.locator('.lang-switcher .lang-switcher__pill', { hasText: 'EN' }).first().click();
await page.waitForTimeout(1000);
console.log('Step 4: CZ firmy → EN click →', page.url());
// Měl by vést na /en/companies, ne na /en

// Test 3: z EN companies na DE
await page.locator('.lang-switcher .lang-switcher__pill', { hasText: 'DE' }).first().click();
await page.waitForTimeout(1000);
console.log('Step 5: EN companies → DE click →', page.url());
// Měl by vést na /de/unternehmen

// Test 4: z diagnostiky EN
await page.goto('http://localhost:4321/en/diagnostic', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.locator('.lang-switcher .lang-switcher__pill', { hasText: 'DE' }).first().click();
await page.waitForTimeout(1000);
console.log('Step 6: EN diagnostic → DE click →', page.url());
// Měl by vést na /de/diagnose

if (errors.length) {
    console.log('\nCHYBY:');
    errors.forEach(e => console.log('  ' + e));
} else {
    console.log('\n✓ Žádné chyby');
}

await browser.close();
