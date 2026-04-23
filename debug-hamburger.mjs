import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['Pixel 7'] });
const page = await ctx.newPage();

page.on('console', (msg) => console.log(`[${msg.type()}]`, msg.text()));
page.on('pageerror', (err) => console.log('[PAGE ERROR]', err.message));

await page.goto('https://stepanmanda.github.io/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// Kontrola: existuje button, je viditelný, je klikatelný?
const info = await page.evaluate(() => {
    const btn = document.getElementById('nav-toggle');
    const drawer = document.getElementById('mobile-drawer');

    if (!btn) return { err: 'BUTTON NEEXISTUJE' };

    const btnRect = btn.getBoundingClientRect();
    const btnStyle = getComputedStyle(btn);

    // Co je na pozici kliknutí?
    const cx = btnRect.left + btnRect.width / 2;
    const cy = btnRect.top + btnRect.height / 2;
    const elAtPoint = document.elementFromPoint(cx, cy);

    // Handler na button připojen?
    const hasClickListener = btn.onclick !== null;

    return {
        btn: {
            rect: { x: btnRect.x, y: btnRect.y, w: btnRect.width, h: btnRect.height },
            display: btnStyle.display,
            visibility: btnStyle.visibility,
            pointerEvents: btnStyle.pointerEvents,
            zIndex: btnStyle.zIndex,
            opacity: btnStyle.opacity,
        },
        elementAtButtonCenter: elAtPoint ? {
            tag: elAtPoint.tagName,
            id: elAtPoint.id,
            className: elAtPoint.className?.toString().substring(0, 80),
        } : null,
        drawer: drawer ? {
            hasIsOpen: drawer.classList.contains('is-open'),
            display: getComputedStyle(drawer).display,
            zIndex: getComputedStyle(drawer).zIndex,
        } : 'NEEXISTUJE',
        hasClickListener,
    };
});
console.log(JSON.stringify(info, null, 2));

// Zkusíme kliknout
console.log('\n>>> Klikám na button...');
await page.locator('#nav-toggle').click();
await page.waitForTimeout(500);

const after = await page.evaluate(() => {
    const drawer = document.getElementById('mobile-drawer');
    const btn = document.getElementById('nav-toggle');
    return {
        drawerIsOpen: drawer?.classList.contains('is-open'),
        drawerOpacity: drawer ? getComputedStyle(drawer).opacity : null,
        btnAriaExpanded: btn?.getAttribute('aria-expanded'),
    };
});
console.log('Po kliknutí:', JSON.stringify(after, null, 2));

await browser.close();
