# Font Awesome preset

`@vuecs/icons-font-awesome` populates vuecs's semantic-slot defaults with [Font Awesome 6 Solid](https://fontawesome.com/icons) Iconify names (`fa6-solid:*`). Successor to the removed `@vuecs/theme-font-awesome` — same visuals, but driven through `<VCIcon>` (Iconify) instead of CSS-class injection.

```bash
npm install @vuecs/icons-font-awesome
```

## Setup

```ts
import vuecs from '@vuecs/core';
import fontAwesome from '@vuecs/icons-font-awesome';

app.use(vuecs, {
    icons: [fontAwesome()],
});
```

The preset is config-only — no icon data ships with this package. Wire icon delivery via your existing tooling. See [Icons setup → Delivery options](/getting-started/icons#delivery-options) for the full recipes.

## What it configures

| Component | Slot | Icon |
|-----------|------|------|
| `VCPagination` | `firstIcon` | `fa6-solid:angles-left` |
| `VCPagination` | `prevIcon`  | `fa6-solid:chevron-left` |
| `VCPagination` | `nextIcon`  | `fa6-solid:chevron-right` |
| `VCPagination` | `lastIcon`  | `fa6-solid:angles-right` |
| `useSubmitButton()` | `createIcon` | `fa6-solid:plus` |
| `useSubmitButton()` | `updateIcon` | `fa6-solid:floppy-disk` |

## Migrating from `@vuecs/theme-font-awesome`

The old package was a **theme** — it injected `fa fa-*` class strings into theme slots like `pagination.prevIcon`. Components rendered `<i :class="theme.prevIcon">`.

The new world is **Iconify-backed**: components render `<VCIcon :name="defaults.prevIcon">`, where `defaults.prevIcon` is an Iconify name string like `'fa6-solid:chevron-left'`. The preset configures those defaults.

| Before | After |
|--------|-------|
| `npm install @vuecs/theme-font-awesome` | `npm install @vuecs/icon @vuecs/icons-font-awesome` |
| `import fa from '@vuecs/theme-font-awesome'` | `import fa from '@vuecs/icons-font-awesome'` |
| `themes: [bootstrap(), fa()]` | `themes: [bootstrap()], icons: [fa()]` |
| `<i class="fa fa-plus">` (auto-rendered) | `<VCIcon name="fa6-solid:plus">` (auto-rendered) |
| Font Awesome stylesheet via CSS | Iconify icon delivery (see [Icons setup](/getting-started/icons)) |

## See also

- [Icons setup](/getting-started/icons) — preset + delivery
- [Font Awesome icon search](https://fontawesome.com/icons) — find names; vuecs uses the `fa6-solid:` prefix
