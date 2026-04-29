# Icons

Icon presets are pure-data packages that map vuecs's semantic icon-prop slots (e.g. `pagination.prevIcon`, `submitButton.createIcon`) to specific Iconify names. They are configured separately from themes — themes resolve **CSS class strings**, presets resolve **icon-name strings**.

```ts
import vuecs from '@vuecs/core';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    icons: [lucide()],
});
```

Multiple presets stack in array order; later presets override earlier ones at the slot level (no merge — icon names are atomic strings, not class lists).

## Available presets

| Preset | Package | Collection |
|--------|---------|-----------|
| [Lucide](/icons/lucide) (recommended) | `@vuecs/icons-lucide` | `lucide:*` |
| [Font Awesome 6 Solid](/icons/font-awesome) | `@vuecs/icons-font-awesome` | `fa6-solid:*` |

## Writing your own preset

A preset is a function returning `Icon` (defined in `@vuecs/core`):

```ts
import type { Icon } from '@vuecs/core';

export default function myIcons(): Icon {
    return {
        defaults: {
            pagination: {
                firstIcon: 'tabler:chevrons-left',
                prevIcon: 'tabler:chevron-left',
                nextIcon: 'tabler:chevron-right',
                lastIcon: 'tabler:chevrons-right',
            },
            submitButton: {
                createIcon: 'tabler:plus',
                updateIcon: 'tabler:device-floppy',
            },
        },
    };
}
```

`defaults` is a `Partial<ComponentDefaults>`, so each preset only needs to provide the slots it cares about.

## See also

- [Icons setup](/getting-started/icons) — preset + runtime delivery
- [`@vuecs/icon` component](/components/icon) — `<VCIcon>` reference
