import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const page = await ctx.newPage();

await page.goto('http://localhost:4321/firmy', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await page.evaluate(() => document.getElementById('kalkulacka')?.scrollIntoView({ block: 'start' }));
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/velyos-roi-mobile.png', fullPage: false });

// Full page mobile kalkulačka
await page.screenshot({ path: '/tmp/velyos-roi-mobile-full.png', fullPage: true });

await browser.close();
console.log('Mobilní screenshoty hotové');
