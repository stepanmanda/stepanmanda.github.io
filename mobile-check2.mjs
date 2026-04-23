import { chromium, devices } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const page = await ctx.newPage();

await page.goto('https://stepanmanda.github.io/firmy', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

await page.screenshot({ path: '/tmp/velyos-mobile-closed2.png', fullPage: false });

// Tap hamburger
await page.locator('#nav-toggle').tap();
await page.waitForTimeout(600);

await page.screenshot({ path: '/tmp/velyos-mobile-open2.png', fullPage: false });

// State check
const state = await page.evaluate(() => {
    const d = document.getElementById('mobile-drawer');
    return {
        opacity: getComputedStyle(d).opacity,
        zIndex: getComputedStyle(d).zIndex,
        isOpen: d.classList.contains('is-open'),
        bodyNavOpen: document.body.classList.contains('nav-open'),
    };
});
console.log('Drawer state:', JSON.stringify(state));

await browser.close();
