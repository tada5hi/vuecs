import { expect, test } from '@playwright/test';
import { sharedRoutes } from '@vuecs-examples/shared/routes';

/**
 * Per-theme × per-route snapshot matrix.
 *
 * Drives the same `sharedRoutes` catalog the example apps consume —
 * adding a new view to `examples/_shared/src/routes.ts` automatically
 * lights it up in this matrix on every theme.
 */
const themes = [
    { name: 'tailwind', baseUrl: 'http://localhost:5180' },
    { name: 'bootstrap', baseUrl: 'http://localhost:5181' },
    { name: 'bulma', baseUrl: 'http://localhost:5182' },
] as const;

for (const theme of themes) {
    test.describe(`theme-${theme.name}`, () => {
        for (const route of sharedRoutes) {
            test(`captures ${route.name}`, async ({ page }) => {
                await page.goto(`${theme.baseUrl}${route.path}`);

                /*
                 * Wait for the route's demo content to mount. Each demo
                 * view renders inside `<main>`, so anchoring on a stable
                 * sentinel inside main avoids flake from router-link
                 * navigation transitions and lazy-loaded chunks.
                 */
                await page.waitForLoadState('networkidle');
                await page.waitForFunction(() => {
                    const main = document.querySelector('main');
                    return main !== null && main.children.length > 0;
                });

                /*
                 * Render fonts before snapshotting. Playwright doesn't
                 * include a font-ready primitive; document.fonts.ready
                 * is the standards-based equivalent.
                 */
                await page.evaluate(() => document.fonts.ready);

                await expect(page).toHaveScreenshot(
                    `${theme.name}-${route.name}.png`,
                    { fullPage: true },
                );
            });
        }
    });
}
