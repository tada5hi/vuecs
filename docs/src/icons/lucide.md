# Lucide preset

`@vuecs/icons-lucide` populates vuecs's semantic-slot defaults with [Lucide](https://lucide.dev/) Iconify names (`lucide:*`).

```bash
npm install @vuecs/icons-lucide
```

## Setup

```ts
import vuecs from '@vuecs/core';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    icons: [lucide()],
});
```

The preset is config-only — no icon data ships with this package. Wire icon delivery via your existing tooling. See [Icons setup → Delivery options](/getting-started/icons#delivery-options) for the full recipes (Nuxt + `@nuxt/icon`, manual `addCollection()`, `unplugin-icons`, or the Iconify CDN).

## What it configures

| Component | Slot | Icon |
|-----------|------|------|
| `VCPagination` | `firstIcon` | `lucide:chevrons-left` |
| `VCPagination` | `prevIcon`  | `lucide:chevron-left` |
| `VCPagination` | `nextIcon`  | `lucide:chevron-right` |
| `VCPagination` | `lastIcon`  | `lucide:chevrons-right` |
| `useSubmitButton()` | `createIcon` | `lucide:plus` |
| `useSubmitButton()` | `updateIcon` | `lucide:save` |

## See also

- [Icons setup](/getting-started/icons) — preset + delivery
- [Lucide icon search](https://lucide.dev/icons/) — find Iconify names for per-instance overrides
