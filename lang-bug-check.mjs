import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Najdi všechny lang pills a zkontroluj jejich href
const pills = await page.$$eval('.lang-switcher__pill', (els) =>
    els.map((el) => ({
        text: el.textContent.trim(),
        href: el.getAttribute('href'),
        hreflang: el.getAttribute('hreflang'),
        active: el.classList.contains('is-active'),
    }))
);
console.log('Pills na rozcestníku (/):');
pills.forEach(p => console.log(`  ${p.text}: href=${p.href} hreflang=${p.hreflang} active=${p.active}`));

// Klikni na EN
const enPill = page.locator('.lang-switcher .lang-switcher__pill', { hasText: 'EN' }).first();
const enHref = await enPill.getAttribute('href');
console.log('\nEN href:', enHref);

await enPill.click();
await page.waitForTimeout(1500);
console.log('Po kliknutí URL:', page.url());

// A nyní zkontroluj lang pills na této nové stránce
const newPills = await page.$$eval('.lang-switcher__pill', (els) =>
    els.map((el) => ({ text: el.textContent.trim(), href: el.getAttribute('href'), active: el.classList.contains('is-active') }))
);
console.log('\nPills na nové stránce:');
newPills.forEach(p => console.log(`  ${p.text}: href=${p.href} active=${p.active}`));

await browser.close();
