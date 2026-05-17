import type { Icon } from '@vuecs/core';

/**
 * Font Awesome icon preset for vuecs (successor to `@vuecs/theme-font-awesome`).
 *
 * Maps vuecs's semantic-slot behavioral defaults to Font Awesome 6 Solid
 * Iconify names (e.g. `fa6-solid:chevron-left`).
 *
 * Pure configuration — no runtime icon data ships with this package.
 * Consumers wire icon delivery via their own tooling:
 * - **Nuxt + `@nuxt/icon`** (recommended): zero config, full SSR.
 * - **Pure Vue** (Vite SSR / SPA): install `@iconify-json/fa6-solid` and call
 *   `addCollection(faSolid)` in your app entry before `app.mount()`.
 * - **`unplugin-icons`** users: still need a runtime registration step
 *   (`<VCIcon>` resolves names through Iconify's runtime, not via per-icon
 *   imports).
 *
 * See https://vuecs.dev/getting-started/icons for full setup recipes.
 */
export default function fontAwesomeIcons(): Icon {
    return {
        defaults: {
            pagination: {
                firstIcon: 'fa6-solid:angles-left',
                prevIcon: 'fa6-solid:chevron-left',
                nextIcon: 'fa6-solid:chevron-right',
                lastIcon: 'fa6-solid:angles-right',
            },
            submitButton: {
                createIcon: 'fa6-solid:plus',
                updateIcon: 'fa6-solid:floppy-disk',
            },
            collapseTrigger: { chevronIcon: 'fa6-solid:chevron-down' },
            alert: {
                infoIcon: 'fa6-solid:circle-info',
                successIcon: 'fa6-solid:circle-check',
                warningIcon: 'fa6-solid:triangle-exclamation',
                errorIcon: 'fa6-solid:circle-xmark',
            },
        },
    };
}
