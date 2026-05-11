import { defineConfig, devices } from '@playwright/test';

/**
 * Visual-regression CI for vuecs themes (plan 015 P2 / plan 024).
 *
 * Snapshots every shared demo view in each shipping example app
 * (`@vuecs/example-tailwind` :5180, `@vuecs/example-bootstrap` :5181,
 * `@vuecs/example-bulma` :5182). Each example renders the same
 * `examples/_shared/src/views/*.vue` catalog, so the comparison is
 * apples-to-apples across themes.
 *
 * Snapshots live next to each spec under
 * `specs/__snapshots__/<spec>/<theme>-<route>-*.png`. Run
 * `npm run -w @vuecs-tests/visual-regression test:update` to regenerate
 * after intentional visual changes. CI runs in compare-only mode and
 * fails on diff.
 *
 * **Platform note:** snapshots are platform-specific (fonts, antialias).
 * Baselines must be generated in the same OS as CI (Ubuntu) — generate
 * locally via Docker or generate-and-commit in a CI workflow_dispatch
 * run, not directly on macOS/Windows.
 */
export default defineConfig({
    testDir: './specs',

    /*
     * Snapshots live alongside the specs under
     * `__snapshots__/<spec>/<arg>.png`. We pass `arg = '<theme>-<route>'`
     * to `toHaveScreenshot()`, which yields one baseline per
     * theme × route pair — no `{platform}` segment because the CI
     * matrix targets a single platform (Ubuntu). If a future job adds
     * a second platform, append `-{platform}` here.
     */
    snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',

    expect: {
        toHaveScreenshot: {
            /*
             * Pixel-perfect comparison is brittle across font hinting +
             * subpixel rendering. 0.2% pixel-difference tolerance is the
             * Playwright-recommended default for theme-level diffs;
             * tighten later if false positives are rare.
             */
            maxDiffPixelRatio: 0.002,
            animations: 'disabled',
            caret: 'hide',
        },
    },

    // Run specs in parallel — each app serves on its own port, no cross-talk.
    fullyParallel: true,

    // No retries — flaky tests should be fixed, not papered over.
    retries: 0,

    // Single worker locally to keep diff output readable; CI can override.
    workers: process.env.CI ? 2 : 1,

    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

    use: {
        // Each spec composes its own base URL based on theme.
        viewport: { width: 1280, height: 800 },
        // Wait for fonts before snapshotting — otherwise FOUC shifts text.
        actionTimeout: 5_000,
        navigationTimeout: 10_000,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    /*
     * Boot all three example apps before running specs. Playwright reuses
     * a server if it's already running locally (handy when iterating —
     * keeps your manual `vite` dev session alive).
     */
    webServer: [
        {
            command: 'npm run -w @vuecs/example-tailwind dev',
            url: 'http://localhost:5180',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
        {
            command: 'npm run -w @vuecs/example-bootstrap dev',
            url: 'http://localhost:5181',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
        {
            command: 'npm run -w @vuecs/example-bulma dev',
            url: 'http://localhost:5182',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
    ],
});
