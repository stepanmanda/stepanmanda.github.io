import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
    use: {
        baseURL: 'http://localhost:4321',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        // Deterministické snapshoty — vypnout animace
        reducedMotion: 'reduce',
        locale: 'cs-CZ',
        timezoneId: 'Europe/Prague',
    },
    expect: {
        toHaveScreenshot: {
            // Tolerance pro subtilní rozdíly (font rendering, anti-aliasing)
            maxDiffPixelRatio: 0.02,
            animations: 'disabled',
        },
    },
    projects: [
        {
            name: 'desktop-chrome',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1440, height: 900 },
            },
        },
        {
            name: 'mobile-chrome',
            use: {
                ...devices['Pixel 7'],
            },
        },
    ],
    webServer: {
        command: 'npm run dev',
        port: 4321,
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
    },
});
