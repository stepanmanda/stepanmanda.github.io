import { test, expect } from '@playwright/test';

// Vizuální regresní testy — screenshoty hlavních stránek
// Baseline se vygeneruje při prvním spuštění, potom se porovnává.

const pages = [
    { path: '/', name: 'rozcestnik' },
    { path: '/firmy', name: 'firmy' },
    { path: '/jednotlivci', name: 'jednotlivci' },
    { path: '/o-nas', name: 'o-nas' },
    { path: '/pristup', name: 'pristup' },
    { path: '/pripadove-studie', name: 'pripadove-studie' },
    { path: '/kontakt', name: 'kontakt' },
    { path: '/diagnostika', name: 'diagnostika' },
];

test.describe('Vizuální regrese — full page screenshoty', () => {
    for (const page of pages) {
        test(`${page.name} — full page screenshot`, async ({ page: p, browserName }, testInfo) => {
            await p.goto(page.path);

            // Počkej, až se načtou fonty (Google Fonts)
            await p.waitForLoadState('networkidle');

            // Skryj floating elementy, co můžou být proměnlivé (widget může být různě stylovaný podle stavu)
            await p.addStyleTag({
                content: `
                    /* Deterministické snímky — vypnout všechny animace a proměnlivé prvky */
                    *, *::before, *::after {
                        animation: none !important;
                        transition: none !important;
                    }
                    elevenlabs-convai { opacity: 0 !important; }
                    .preview-ribbon { display: none !important; }
                    .hero__glow, .cta-band__glow, .diagnostika-hero__glow,
                    .agent-diagnostic__glow {
                        opacity: 0.85 !important;
                        transform: none !important;
                    }
                    .brand::before, .brand::after,
                    .agent-diagnostic__dot, .agent-card__dot {
                        animation: none !important;
                        box-shadow: none !important;
                    }
                    .os { text-shadow: none !important; }
                `,
            });

            // Dej fontům chvíli
            await p.waitForTimeout(500);

            await expect(p).toHaveScreenshot(`${page.name}.png`, {
                fullPage: true,
            });
        });
    }
});

test.describe('Vizuální regrese — hero oblast', () => {
    for (const page of pages) {
        test(`${page.name} — above the fold`, async ({ page: p }) => {
            await p.goto(page.path);
            await p.waitForLoadState('networkidle');

            await p.addStyleTag({
                content: `
                    /* Deterministické snímky — vypnout všechny animace a proměnlivé prvky */
                    *, *::before, *::after {
                        animation: none !important;
                        transition: none !important;
                    }
                    elevenlabs-convai { opacity: 0 !important; }
                    .preview-ribbon { display: none !important; }
                    .hero__glow, .cta-band__glow, .diagnostika-hero__glow,
                    .agent-diagnostic__glow {
                        opacity: 0.85 !important;
                        transform: none !important;
                    }
                    .brand::before, .brand::after,
                    .agent-diagnostic__dot, .agent-card__dot {
                        animation: none !important;
                        box-shadow: none !important;
                    }
                    .os { text-shadow: none !important; }
                `,
            });

            await p.waitForTimeout(500);

            await expect(p).toHaveScreenshot(`${page.name}-hero.png`, {
                fullPage: false,
            });
        });
    }
});
