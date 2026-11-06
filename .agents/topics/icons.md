# Icons (@vuecs/icon + presets)

Icons are an **icon-name vocabulary** layer that sits beside themes and
behavioral defaults. Components expose icon-name props (Iconify strings like
`'lucide:plus'`) which `<VCIcon>` resolves at render time. Themes don't inject
icon classes anymore — that responsibility split out into the icon presets.

### Layers

```
1. <VCIcon name="lucide:plus" />          ← runtime component (@vuecs/icon)
2. component prop (e.g. VCPagination.prevIcon)
3. icons: [lucide()] preset               ← populates DefaultsManager keys
4. consumer defaults (defaults: { pagination: { prevIcon: '…' } })
5. behavioralDefaults (component-local, lowest priority)
```

The `icons:` slot in `CoreOptions` accepts an array of `Icon` objects:

```ts
import type { Icon } from '@vuecs/core';

export type Icon = {
    defaults?: Partial<ComponentDefaults>;
};
```

`@vuecs/core`'s top-level `install()` merges every preset's `defaults` into the
DefaultsManager (in array order, with consumer-supplied `defaults:` winning).
After merge, the icon-prop layer disappears — every prop resolves through the
existing behavioral-defaults pipeline. So presets are pure config; no new
manager, no new composable.

### `<VCIcon>`

Thin wrapper around `@iconify/vue`'s `<Icon>`. Single required prop `name`
(Iconify string), all other attrs forwarded. Globally registered when
`@vuecs/icon`'s plugin is installed. Lives in `packages/icon/`.

`<VCIcon>` does NOT bundle icon data. Consumers wire delivery via:
- `@nuxt/icon` (Nuxt apps)
- Manual `addCollection()` from an `@iconify-json/<collection>` package (Vite/SPA)
- Iconify's runtime CDN (default fallback)

### Presets

Pure-data packages in the top-level `icons/` directory (parallel to `packages/`
and `themes/`). Each is a function returning `Icon`:

```ts
// icons/lucide/src/index.ts
import type { Icon } from '@vuecs/core';

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
        },
    };
}
```

Two presets ship today: `@vuecs/icons-lucide` (modern default) and
`@vuecs/icons-font-awesome` (replaces the removed `@vuecs/theme-font-awesome`).
Other Iconify collections work without a preset — pass the icon name directly
to a component prop.
