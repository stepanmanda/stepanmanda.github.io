import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// CZ
await page.goto('http://localhost:4321/firmy#kalkulacka', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await page.evaluate(() => document.getElementById('kalkulacka').scrollIntoView({ block: 'start' }));
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/velyos-roi-cz.png', fullPage: false });

// Interakce — změň sliders
await page.locator('#roi-hours').fill('25');
await page.locator('#roi-people').fill('50');
await page.locator('#roi-rate').fill('1500');
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/velyos-roi-cz-high.png', fullPage: false });

const czResult = await page.evaluate(() => {
    return {
        yearlyLoss: document.querySelector('[data-result="yearly-loss"]').textContent,
        velyosSavings: document.querySelector('[data-result="velyos-savings"]').textContent,
        velyosHours: document.querySelector('[data-result="velyos-hours"]').textContent,
    };
});
console.log('CZ (25h/50 people/1500Kč):', JSON.stringify(czResult));

// EN
await page.goto('http://localhost:4321/en/companies#kalkulacka', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await page.evaluate(() => document.getElementById('kalkulacka').scrollIntoView({ block: 'start' }));
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/velyos-roi-en.png', fullPage: false });

const enResult = await page.evaluate(() => ({
    yearlyLoss: document.querySelector('[data-result="yearly-loss"]').textContent,
    velyosSavings: document.querySelector('[data-result="velyos-savings"]').textContent,
}));
console.log('EN default:', JSON.stringify(enResult));

// DE
await page.goto('http://localhost:4321/de/unternehmen#kalkulacka', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await page.evaluate(() => document.getElementById('kalkulacka').scrollIntoView({ block: 'start' }));
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/velyos-roi-de.png', fullPage: false });

await browser.close();

// Mobile
const mobileCtx = await browser.newContext?.({ ...devices['iPhone 14'] }).catch(() => null);
if (mobileCtx) {
    const m = await mobileCtx.newPage();
    await m.goto('http://localhost:4321/firmy#kalkulacka', { waitUntil: 'domcontentloaded' });
    await m.waitForTimeout(2000);
    await m.evaluate(() => document.getElementById('kalkulacka').scrollIntoView({ block: 'start' }));
    await m.waitForTimeout(500);
    await m.screenshot({ path: '/tmp/velyos-roi-mobile.png', fullPage: false });
    await mobileCtx.close();
}

console.log('\nScreenshoty:');
console.log('  /tmp/velyos-roi-cz.png         (CZ defaults)');
console.log('  /tmp/velyos-roi-cz-high.png    (CZ 25h/50 people/1500Kč)');
console.log('  /tmp/velyos-roi-en.png         (EN)');
console.log('  /tmp/velyos-roi-de.png         (DE)');
