import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';
import type { App } from 'vue';

/*
 * Shared `@vuecs/core` install for every demo. Each iframe is its own
 * Vue app, so this runs once per demo. The theme config here is the
 * canonical "what a docs visitor sees" setup — mirrors a real consumer
 * who picked Tailwind. To showcase a different theme combination in a
 * specific demo, call `app.use(vuecs, { themes: [...] })` directly in
 * that demo's `<name>.ts` instead of routing through this helper.
 */
export function installVuecs(app: App): void {
    app.use(vuecs, { themes: [tailwindTheme()] });
}
