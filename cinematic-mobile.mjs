import { chromium, devices } from 'playwright';

const browser = await chromium.launch();

// 1. Mobile check
const mobileCtx = await browser.newContext({ ...devices['iPhone 14'] });
const m = await mobileCtx.newPage();
await m.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
await m.waitForTimeout(2500);
await m.screenshot({ path: '/tmp/velyos-hero-mobile-home.png', fullPage: false });
await m.goto('http://localhost:4321/firmy', { waitUntil: 'domcontentloaded' });
await m.waitForTimeout(2500);
await m.screenshot({ path: '/tmp/velyos-hero-mobile-firmy.png', fullPage: false });
await mobileCtx.close();

// 2. Reduced-motion check
const rmCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
});
const rm = await rmCtx.newPage();
await rm.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
await rm.waitForTimeout(1500);
await rm.screenshot({ path: '/tmp/velyos-hero-reducedmotion.png', fullPage: false });

const rmState = await rm.evaluate(() => {
    const canvas = document.querySelector('.hero__mesh');
    const wordCount = document.querySelectorAll('.hero__title .word').length;
    return {
        canvasDisplay: canvas ? getComputedStyle(canvas).display : 'missing',
        wordCount,
    };
});
console.log('Reduced motion stav:', JSON.stringify(rmState));
await rmCtx.close();

// 3. Firmy H1 check po změně
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:4321/firmy', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
await page.screenshot({ path: '/tmp/velyos-hero-firmy-v2.png', fullPage: false });

const firmyH1 = await page.locator('h1').first().textContent();
console.log('Firmy H1:', firmyH1);

await browser.close();

console.log('\nScreenshoty:');
console.log('  /tmp/velyos-hero-mobile-home.png       (iPhone rozcestník)');
console.log('  /tmp/velyos-hero-mobile-firmy.png      (iPhone Firmy)');
console.log('  /tmp/velyos-hero-reducedmotion.png     (reduced-motion = canvas skrytý)');
console.log('  /tmp/velyos-hero-firmy-v2.png          (Firmy s novým H1)');
