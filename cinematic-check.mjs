import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
});
const page = await ctx.newPage();

// Homepage — immediate screenshot (vidíme init state + text reveal in progress)
await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/velyos-hero-init.png', fullPage: false });

// Plně načtený stav (canvas anim běží, text reveal hotový)
await page.waitForTimeout(2500);
await page.screenshot({ path: '/tmp/velyos-hero-loaded.png', fullPage: false });

// Simulace mouse hover — parallax
await page.mouse.move(200, 200);
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/velyos-hero-mouse-left.png', fullPage: false });

await page.mouse.move(1200, 700);
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/velyos-hero-mouse-right.png', fullPage: false });

// Check errorů v console
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
});

// Test Firmy (dense variant)
await page.goto('http://localhost:4321/firmy', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/velyos-hero-firmy.png', fullPage: false });

// EN verze
await page.goto('http://localhost:4321/en', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/velyos-hero-en.png', fullPage: false });

console.log('Screenshoty:');
console.log('  /tmp/velyos-hero-init.png          (prvních 400ms)');
console.log('  /tmp/velyos-hero-loaded.png        (plně načtený)');
console.log('  /tmp/velyos-hero-mouse-left.png    (mouse vlevo nahoře)');
console.log('  /tmp/velyos-hero-mouse-right.png   (mouse vpravo dole)');
console.log('  /tmp/velyos-hero-firmy.png         (Firmy varianta)');
console.log('  /tmp/velyos-hero-en.png            (EN varianta)');

if (errors.length) {
    console.log('\nCHYBY:');
    errors.forEach((e) => console.log('  ' + e));
} else {
    console.log('\n✓ Žádné console/page errory');
}

// Ověř že canvas má is-ready třídu (mesh se zapnul)
const meshReady = await page.evaluate(() => {
    const c = document.querySelector('.hero__mesh');
    return c && c.classList.contains('is-ready');
});
console.log(`\nCanvas mesh is-ready: ${meshReady}`);

// Ověř že H1 má word spans (text reveal funguje)
const wordCount = await page.evaluate(() => {
    return document.querySelectorAll('.hero__title .word').length;
});
console.log(`H1 word spans: ${wordCount}`);

await browser.close();
