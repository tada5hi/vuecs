# Guide

The guide section covers the concepts behind vuecs in depth. Read these once, and the rest of the docs will read more like a reference.

## Concepts

- **[Theme System](/guide/theme-system)** — the four-layer class resolution chain (defaults → themes → overrides → instance props).
- **[Variants](/guide/variants)** — structured variants, compound variants, and the merge rules across layers.
- **[Behavioral Defaults](/guide/behavioral-defaults)** — the parallel resolution system for non-class props (button text, placeholders, content strings) — the i18n hook.
- **[Design Tokens](/guide/design-tokens)** — `@vuecs/design`, the CSS custom-property layer underneath the class system.
- **[Navigation](/guide/navigation)** — `@vuecs/navigation`'s per-call-site `:data` items, the shared reactive registry for dependent navs, and soft `vue-router` integration.

## Mental model

vuecs has three orthogonal systems that you configure independently in `app.use(vuecs, ...)`:

```text
┌─ themes/overrides ─────────────────────┐  → CSS class strings
│  layered resolution → class name(s)     │
└────────────────────────────────────────┘
┌─ defaults ─────────────────────────────┐  → behavioral values (text, booleans)
│  layered resolution → unwrapped value   │
└────────────────────────────────────────┘
┌─ design tokens (CSS variables) ────────┐  → concrete colors / radii
│  flip under .dark, swap via setColorPalette  │
└────────────────────────────────────────┘
        │
        ▼  components reference the first two via composables,
           the third via the class strings the first system produces
```

Each system has its own composable: `useComponentTheme`, `useComponentDefaults`. The design-token layer needs no composable — it's pure CSS.
