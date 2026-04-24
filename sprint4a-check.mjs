import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e)));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });

// 1. Homepage cold load — boot animace měla by hrát
await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/velyos-boot-300ms.png' });
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/velyos-boot-done.png' });

// 2. Klik na "Pro firmy" — View Transitions
await page.click('nav.nav a[href="/firmy"]');
await page.waitForTimeout(200);
await page.screenshot({ path: '/tmp/velyos-transition-mid.png' });
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/velyos-firmy-loaded.png' });

// 3. Scroll ke kalkulačce
await page.evaluate(() => document.getElementById('kalkulacka')?.scrollIntoView({ block: 'start' }));
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/velyos-roi-scrolled.png' });

// 4. Scroll na 5-krokovou cestu
await page.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find(h2 => h2.textContent.includes('Čtyři kroky') || h2.textContent.includes('Pět kroků'));
    if (h) h.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/velyos-5steps.png' });

// 5. Školení callout scroll
await page.evaluate(() => {
    const el = [...document.querySelectorAll('.callout')].find(c => c.textContent.includes('proškolíme') || c.textContent.includes('školení'));
    if (el) el.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/velyos-training-callout.png' });

if (errors.length) {
    console.log('CHYBY:');
    errors.forEach(e => console.log('  ' + e));
} else {
    console.log('✓ Žádné chyby');
}

// Ověř že boot letters jsou v DOM
const brandCheck = await page.evaluate(() => {
    const letters = document.querySelectorAll('.brand .brand-letter').length;
    return { letters };
});
console.log('Brand boot letters count:', brandCheck.letters);

await browser.close();
console.log('\nScreenshoty:');
console.log('  /tmp/velyos-boot-300ms.png');
console.log('  /tmp/velyos-boot-done.png');
console.log('  /tmp/velyos-transition-mid.png');
console.log('  /tmp/velyos-firmy-loaded.png');
console.log('  /tmp/velyos-roi-scrolled.png');
console.log('  /tmp/velyos-5steps.png');
console.log('  /tmp/velyos-training-callout.png');
