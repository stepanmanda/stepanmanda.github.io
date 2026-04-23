import { chromium, devices } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['Pixel 7'] });
const page = await ctx.newPage();

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Closed
await page.screenshot({ path: '/tmp/velyos-mobile-closed.png' });

// Open
await page.locator('#nav-toggle').click();
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/velyos-mobile-open.png' });

await browser.close();
console.log('/tmp/velyos-mobile-closed.png + /tmp/velyos-mobile-open.png');
