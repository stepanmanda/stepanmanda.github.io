import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const page = await ctx.newPage();

await page.goto('http://localhost:4321/firmy', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// Lokace elementu a screenshot jen té oblasti
const box = await page.locator('#kalkulacka').boundingBox();
if (box) {
    await page.evaluate((y) => window.scrollTo(0, y), box.y - 20);
    await page.waitForTimeout(800);
    await page.screenshot({ path: '/tmp/velyos-roi-mobile.png' });
    console.log('Kalkulačka na mobilu:', JSON.stringify(box));
} else {
    console.log('element nenalezen');
}

await browser.close();
