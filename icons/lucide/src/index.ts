import type { Icon } from '@vuecs/core';

/**
 * Lucide icon preset for vuecs.
 *
 * Maps vuecs's semantic-slot behavioral defaults to Lucide Iconify names
 * (e.g. `lucide:chevron-left`).
 *
 * Pure configuration — no runtime icon data ships with this package.
 * Consumers wire icon delivery via their own tooling:
 * - **Nuxt + `@nuxt/icon`** (recommended): zero config, full SSR.
 * - **Pure Vue** (Vite SSR / SPA): install `@iconify-json/lucide` and call
 *   `addCollection(lucide)` in your app entry before `app.mount()`.
 * - **`unplugin-icons`** users: still need a runtime registration step
 *   (`<VCIcon>` resolves names through Iconify's runtime, not via per-icon
 *   imports).
 *
 * See https://vuecs.dev/getting-started/icons for full setup recipes.
 */
export default function lucideIcons(): Icon {
    return {
        defaults: {
            pagination: {
                firstIcon: 'lucide:chevrons-left',
                prevIcon: 'lucide:chevron-left',
                nextIcon: 'lucide:chevron-right',
                lastIcon: 'lucide:chevrons-right',
            },
            submitButton: {
                createIcon: 'lucide:plus',
                updateIcon: 'lucide:save',
            },
            collapseTrigger: { chevronIcon: 'lucide:chevron-down' },
            alert: {
                infoIcon: 'lucide:info',
                successIcon: 'lucide:circle-check',
                warningIcon: 'lucide:triangle-alert',
                errorIcon: 'lucide:circle-x',
            },
        },
    };
}
