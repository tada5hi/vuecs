# Undesigned Components

vuecs components ship **undesigned**. Out of the box, a `<VCButton>` or `<VCTable>` brings structure (the DOM shape), behavior (state, keyboard handling), and accessibility (ARIA wiring, focus management) — but **no design opinion**. The only CSS a component carries is a minimal structural layer (`vc-*` classes: layout, sizing mechanics) that any look requires.

The design comes from a **theme**: pure data that maps each component's named slots to CSS class strings. A layered resolution engine merges the two at runtime.

```ts
app.use(vuecs, { themes: [tailwind()] });   // components render Tailwind utilities
app.use(vuecs, { themes: [bootstrap()] });  // same components, now .btn / .card / .form-control
```

This page explains why that split exists, who it serves, and what it implies for how you work with vuecs.

## Why split structure from design?

Most component libraries bake a design system into the component. The class strings live inside the render function; restyling means prop-based escape hatches, CSS overrides with specificity fights, or forking.

vuecs treats the class strings as **configuration, not implementation**. Every component resolves its classes through the [four-layer theme chain](/guide/theme-system) (defaults → themes → overrides → instance props) at render time. Consequences:

- **A theme is data.** A function returning `{ elements: { button: { classes: ... } } }`. It can be published, composed via [`defineTheme()`](/guide/composing-themes), stacked with other themes, and swapped at runtime.
- **The component never knows which design system it's wearing.** The Bootstrap theme emits Bootstrap's *native* classes (`.btn`, `.card`, `.modal-content`), so vuecs components sit seamlessly next to hand-written Bootstrap markup. Same for Bulma. The Tailwind theme emits utilities resolved through [design tokens](/guide/design-tokens).
- **Restyling is never a fork.** Override one slot of one component (`overrides`), one instance (`themeClass`), or the whole app (swap the theme) — the component code is untouched in every case.

## Who this is for

**Apps on Bootstrap or Bulma that want modern components.** Most current Vue component libraries assume Tailwind or ship their own design system. With vuecs you get accessible modals, sortable tables, comboboxes and more — and the matching theme supplies your framework's native classes, so there are no visual seams and no second design system in the bundle.

**Apps migrating between design systems.** Because design lives in a config layer, moving from Bootstrap to Tailwind (or re-branding) is a theme swap plus token adjustments — not a touch-every-call-site rewrite. Both themes can even be installed during the transition.

**Component-library authors.** This is the deepest consequence, covered in the next section.

**White-label and multi-tenant apps.** Palette, color mode, and theme are runtime state. Per-customer branding is a config object — [`useColorPalette().set({ primary: 'emerald' })`](/guide/design-tokens) — not a build per tenant.

If none of these apply — you're greenfield, all-in on Tailwind, and never publishing components — a Tailwind-native kit serves you just as well. vuecs exists for when the CSS framework is a constraint you don't control.

## The library-author contract

The theme system is **public API, not internal plumbing**. Anything `@vuecs/*` components do, your components can do:

1. **Declare a typed slot map** on `ThemeElements` via declaration merging — your component name appears in theme autocomplete next to vuecs's built-ins.
2. **Resolve classes** through `useComponentTheme()` (plus the `themableProps` / `useThemeProps` helpers), exposing the same `themeClass` / `themeVariant` props every vuecs component has.
3. **Ship your default styling** as a theme — either component-local defaults, or a published theme built on an existing one via `defineTheme({ extends: tailwindTheme(), ... })`.

The payoff for your consumers: **one config reskins the union** — vuecs primitives, your library, and any other library on the contract — through the same `app.use(vuecs, { themes, overrides })` call. You ship components *with* a designed default look, but without dictating a CSS framework: a Bootstrap shop restyles your library to Bootstrap the same way they'd restyle a `<VCButton>`.

No registration, no plugin coupling, no parallel theme system to document. The full worked example lives at [Build Your Own Themable Component](/guide/build-themable-component).

## What "undesigned" does NOT mean

- **Not unstyled-and-broken without a theme.** The structural `vc-*` CSS keeps components functional and laid out; packages like `@vuecs/placeholder` are fully usable with zero theme installed. A theme adds the visual identity.
- **Not headless.** Headless libraries (Reka UI, Headless UI) give you behavior and *no markup contract* — you write the rendering. vuecs components render complete, opinionated DOM with named theme slots. (Internally, vuecs builds on [Reka UI](https://reka-ui.com) primitives for the accessibility heavy lifting — that layer stays an implementation detail.)
- **Not class-string templating only.** Themes also carry [variant definitions](/guide/variants) (`variant` × `color` × `size`, compound variants), runtime hooks for color-mode and palette rendering, and merge functions — a theme is the full design half of a component, not a stylesheet.

## Where to go next

- [Theme System](/guide/theme-system) — the resolution chain that makes the split work.
- [Build Your Own Themable Component](/guide/build-themable-component) — the worked library-author example.
- [Composing Themes](/guide/composing-themes) — publish a theme that extends a shipped one.
- [Bridging CSS Frameworks](/guide/bridging-css-frameworks) — make runtime palette switching reach a framework's native widgets.
