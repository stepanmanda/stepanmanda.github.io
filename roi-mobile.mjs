import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const page = await ctx.newPage();

await page.goto('http://localhost:4321/firmy', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// Screenshot konkrétního elementu
await page.locator('#kalkulacka').screenshot({ path: '/tmp/velyos-roi-mobile.png' });

await browser.close();
console.log('OK');
