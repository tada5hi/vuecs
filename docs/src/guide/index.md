# Guide

The guide section covers the concepts behind vuecs in depth. Read these once, and the rest of the docs will read more like a reference.

## Concepts

How vuecs is configured in an app — read these in order:

- **[Undesigned Components](/guide/undesigned-components)** — the core idea: components ship structure, behavior, and a11y; themes supply the design. Who that split is for, and what it enables for library authors.
- **[Theme System](/guide/theme-system)** — the four-layer class resolution chain (defaults → themes → overrides → instance props).
- **[Variants](/guide/variants)** — structured variants, compound variants, and the merge rules across layers.
- **[Behavioral Defaults](/guide/behavioral-defaults)** — the parallel resolution system for non-class props (button text, placeholders, content strings) — the i18n hook.
- **[Design Tokens](/guide/design-tokens)** — `@vuecs/design`, the CSS custom-property layer underneath the class system.
- **[Composables](/guide/composables)** — the full composable surface: wrapper-building primitives from `@vuecs/core`, color mode + palette from `@vuecs/design`, the locale source from `@vuecs/locale`.

## Authoring

For library authors building components or themes on the same machinery:

- **[Build Your Own Themable Component](/guide/build-themable-component)** — worked example: register a third-party component on the theme system so consumers reskin it through the same `app.use(vuecs, …)` call.
- **[Primitive (as / asChild)](/guide/primitive)** — `<VCPrimitive>`, the generic render-target building block behind `as` / `asChild`.
- **[Composing Themes](/guide/composing-themes)** — `defineTheme()` for authoring themes that build on existing ones.
- **[Bridging CSS Frameworks](/guide/bridging-css-frameworks)** — wire a non-Tailwind framework's runtime tokens onto the design system so palette switching reaches its native components.

## Deep dives

- **[Navigation](/guide/navigation)** — `@vuecs/navigation`'s per-call-site `:data` items, the shared reactive registry for dependent navs, and soft `vue-router` integration.
- **[Validation Feedback](/guide/validation-feedback)** — `<VCFormGroup :validation>`, the `FieldValidation` contract, and how severity flows down to child inputs.

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
