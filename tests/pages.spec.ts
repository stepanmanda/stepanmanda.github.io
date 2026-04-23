import { test, expect } from '@playwright/test';

// Všechny stránky webu + jejich očekávaná klíčová slova v title
const pages = [
    { path: '/', title: /VELYOS.*Velocity Operating System/i, h1: /Vracíme čas|nejvyšší hodnotu/i },
    { path: '/firmy', title: /VELYOS.*Pro firmy/i, h1: /rutina/i },
    { path: '/jednotlivci', title: /VELYOS.*Pro jednotlivce/i, h1: /24 hodin/i },
    { path: '/o-nas', title: /VELYOS.*O nás/i, h1: /Nejsme software/i },
    { path: '/pristup', title: /VELYOS.*Přístup/i, h1: /Jak pracujeme/i },
    { path: '/pripadove-studie', title: /VELYOS.*Vzory nasazení/i, h1: /umíme dodat|pro vás/i },
    { path: '/kontakt', title: /VELYOS.*Kontakt/i, h1: /způsoby|hodin/i },
    { path: '/diagnostika', title: /VELYOS.*Diagnostika/i, h1: /Dvě cesty/i },
];

test.describe('Funkční testy — všechny stránky', () => {
    for (const page of pages) {
        test(`${page.path} — HTTP 200, title, H1, header, footer`, async ({ page: p }) => {
            const response = await p.goto(page.path);

            // HTTP 200
            expect(response?.status(), `${page.path} musí vrátit HTTP 200`).toBe(200);

            // Title má klíčové slovo
            await expect(p, `${page.path} title`).toHaveTitle(page.title);

            // H1 existuje a matchuje očekávaný text
            const h1 = p.locator('h1').first();
            await expect(h1, `${page.path} má H1`).toBeVisible();
            await expect(h1, `${page.path} H1 obsahuje správný text`).toContainText(page.h1);

            // Header s brand + navigací
            const header = p.locator('header.site-header');
            await expect(header, `${page.path} má header`).toBeVisible();
            await expect(header.locator('.brand'), `${page.path} header má brand logo`).toBeVisible();

            // Footer
            const footer = p.locator('footer.site-footer');
            await expect(footer, `${page.path} má footer`).toBeAttached();
        });
    }
});

test.describe('Navigace mezi stránkami', () => {
    test('nav: proklik rozcestník → Pro firmy', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'Pro firmy', exact: true }).first().click();
        await expect(page).toHaveURL(/\/firmy/);
        await expect(page.locator('h1')).toContainText(/rutina/i);
    });

    test('nav: proklik rozcestník → Pro jednotlivce', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'Pro jednotlivce', exact: true }).first().click();
        await expect(page).toHaveURL(/\/jednotlivci/);
        await expect(page.locator('h1')).toContainText(/24 hodin/i);
    });

    test('primary CTA na rozcestníku vede na Firmy', async ({ page }) => {
        await page.goto('/');
        // Klik v hero sekci (ne v split kartě) — omezit na .hero kontext
        const heroCta = page.locator('.hero').getByRole('link', { name: /Chci řešení pro firmu/i });
        await heroCta.scrollIntoViewIfNeeded();
        await heroCta.click();
        await expect(page).toHaveURL(/\/firmy/);
    });

    test('CTA na Firmy hero vede na /diagnostika', async ({ page }) => {
        await page.goto('/firmy');
        const heroCta = page.locator('.hero').getByRole('link', { name: /Chci vidět, kudy mi utíkají peníze/i });
        await heroCta.scrollIntoViewIfNeeded();
        await heroCta.click();
        await expect(page).toHaveURL(/\/diagnostika/);
    });

    test('Footer linky vedou na firmy stránky', async ({ page }) => {
        await page.goto('/');
        const footer = page.locator('footer.site-footer');

        await footer.getByRole('link', { name: 'O nás', exact: true }).click();
        await expect(page).toHaveURL(/\/o-nas/);

        await page.goto('/');
        await footer.getByRole('link', { name: 'Přístup', exact: true }).click();
        await expect(page).toHaveURL(/\/pristup/);

        await page.goto('/');
        await footer.getByRole('link', { name: 'Vzory nasazení', exact: true }).click();
        await expect(page).toHaveURL(/\/pripadove-studie/);

        await page.goto('/');
        await footer.getByRole('link', { name: 'Kontakt', exact: true }).first().click();
        await expect(page).toHaveURL(/\/kontakt/);
    });

    test('Footer legal linky vedou na právní stránky', async ({ page }) => {
        await page.goto('/');

        await page.locator('.site-footer__legal').getByRole('link', { name: 'Impresum' }).click();
        await expect(page).toHaveURL(/\/impresum/);

        await page.goto('/');
        await page.locator('.site-footer__legal').getByRole('link', { name: /osobn[íi]ch údaj/i }).click();
        await expect(page).toHaveURL(/\/ochrana-osobnich-udaju/);
    });
});

test.describe('Mobile hamburger menu', () => {
    test('Hamburger otevře drawer s 7 linky (mobile)', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'mobile-chrome', 'Jen mobile');
        await page.goto('/');

        const toggle = page.locator('#nav-toggle');
        const drawer = page.locator('#mobile-drawer');

        await expect(toggle).toBeVisible();
        await expect(drawer).not.toHaveClass(/is-open/);

        await toggle.click();
        await expect(drawer).toHaveClass(/is-open/);
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');

        // 7 hlavních linků v draweru
        const links = drawer.locator('.mobile-drawer__link');
        await expect(links).toHaveCount(7);

        // Klik na link zavře drawer (ale přejde na stránku)
        await drawer.getByText('Pro firmy').click();
        await expect(page).toHaveURL(/\/firmy/);
    });
});

test.describe('Kontakt popover v nav', () => {
    test('Klik na Kontakt otevře popover s e-mailem a telefonem', async ({ page }, testInfo) => {
        // Nav je na mobilu schovaný (display:none pod 880px) — test jen na desktopu
        test.skip(testInfo.project.name !== 'desktop-chrome', 'Nav Kontakt je jen na desktopu');
        await page.goto('/');

        const trigger = page.locator('.nav-contact__trigger');
        const panel = page.locator('.nav-contact__panel');

        // Před klikem je panel zavřený (nemá is-open)
        await expect(panel).not.toHaveClass(/is-open/);

        // Klik ho otevře
        await trigger.click();
        await expect(panel).toHaveClass(/is-open/);

        // Obsahuje e-mail (telefon se doplní po registraci firmy)
        await expect(panel.locator('a[href^="mailto:"]')).toBeVisible();

        // aria-expanded je true
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');

        // Klik mimo panel ho zavře
        await page.locator('body').click({ position: { x: 100, y: 500 } });
        await expect(panel).not.toHaveClass(/is-open/);
    });
});

test.describe('Diagnostika stránka', () => {
    test('Formulář má všechna povinná pole', async ({ page }) => {
        await page.goto('/diagnostika');

        // Form existuje
        const form = page.locator('#diagnostikovat-form');
        await expect(form).toBeVisible();

        // Povinná pole
        await expect(page.locator('#diag-name')).toBeVisible();
        await expect(page.locator('#diag-position')).toBeVisible();
        await expect(page.locator('#diag-company')).toBeVisible();
        await expect(page.locator('#diag-industry')).toBeVisible();
        await expect(page.locator('#diag-size')).toBeVisible();
        await expect(page.locator('#diag-pain')).toBeVisible();
        await expect(page.locator('#diag-email')).toBeVisible();
        await expect(page.locator('#diag-gdpr')).toBeVisible();

        // Submit tlačítko
        await expect(page.locator('.diag-form__submit')).toContainText(/Odeslat/i);
    });

    test('ElevenLabs widget je na stránce', async ({ page }) => {
        await page.goto('/diagnostika');

        // Custom element existuje v DOM
        const widget = page.locator('elevenlabs-convai');
        await expect(widget).toBeAttached();
        await expect(widget).toHaveAttribute('agent-id', 'cu9gllbBtpZWU6CuJXky');
    });

    test('Prázdný form neodešle — vyžádá GDPR souhlas', async ({ page }) => {
        await page.goto('/diagnostika');

        // Bez vyplnění — browser validation zabrání odeslání, nezavřelo to stránku
        await page.locator('.diag-form__submit').click();
        // URL zůstává stejné (nespustilo mailto redirect)
        await expect(page).toHaveURL(/\/diagnostika/);
    });
});

test.describe('ElevenLabs widget skript je načten', () => {
    test('Skript @elevenlabs/convai-widget-embed je v DOM', async ({ page }) => {
        await page.goto('/diagnostika');
        const widgetScript = page.locator('script[src*="@elevenlabs/convai-widget-embed"]');
        await expect(widgetScript).toBeAttached();
    });
});

test.describe('Žádné mrtvé odkazy v CTA tlačítkách', () => {
    test('Žádný href="#" v hlavních CTA na Firmy', async ({ page }) => {
        await page.goto('/firmy');
        // Všechny .btn prvky — ani jeden nemá href="#"
        const buttons = page.locator('a.btn');
        const count = await buttons.count();
        for (let i = 0; i < count; i++) {
            const href = await buttons.nth(i).getAttribute('href');
            expect(href, `Button ${i} má validní href`).not.toBe('#');
            expect(href, `Button ${i} má href`).toBeTruthy();
        }
    });
});
