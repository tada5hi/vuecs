<p align="center">
  <img src="https://vuecs.dev/logo.svg" alt="vuecs" width="120" />
</p>

<h1 align="center">vuecs</h1>

<p align="center">
  <b>The Vue 3 theming framework.</b><br>
  Components, themes, design tokens, dark mode, runtime palettes & locale —<br>
  all reskinnable through a single <code>app.use()</code> call.
</p>

<p align="center">
  <a href="https://github.com/Tada5hi/vuecs/actions/workflows/main.yml"><img src="https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@vuecs/core"><img src="https://img.shields.io/npm/v/@vuecs/core?label=%40vuecs%2Fcore" alt="npm version" /></a>
  <a href="https://snyk.io/test/github/Tada5hi/vuecs"><img src="https://snyk.io/test/github/Tada5hi/vuecs/badge.svg" alt="Known Vulnerabilities" /></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white" alt="Conventional Commits" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License" /></a>
</p>

<p align="center">
  <a href="https://vuecs.dev"><b>Documentation</b></a>
  ·
  <a href="https://vuecs.dev/getting-started/">Getting Started</a>
  ·
  <a href="https://vuecs.dev/components/">Components</a>
  ·
  <a href="./examples">Example Apps</a>
</p>

---

## Why vuecs?

Most component libraries lock you into one design system. vuecs inverts that: **components describe structure, themes describe looks** — and the two are wired together at runtime by a layered resolution engine.

```ts
app.use(vuecs, { themes: [tailwind()] });   // an entire app, Tailwind-skinned
app.use(vuecs, { themes: [bootstrap()] });  // same app, now Bootstrap — no component changes
```

The value proposition is layered, and every layer is independently consumable:

1. 🎛️ **Theming machinery** (`@vuecs/core`) — `useComponentTheme` / `useComponentDefaults` composables, `<VCConfigProvider>`, `defineTheme()` for composing themes on top of existing ones, a structured **variant system** (`variant` × `color` × `size` × `compoundVariants`), and typed, augmentable registries (`ThemeElements`, `ComponentDefaults`, `Config`).
2. 🧱 **A full baseline of theme-aware components** — buttons, forms, tables, lists, overlays, navigation, pagination, skeletons and more, built on that machinery with [Reka UI](https://reka-ui.com) primitives handling the accessibility heavy lifting.
3. 🔌 **An opt-in path for third-party libraries** to publish components on the same machinery — so one `app.use(vuecs, { ... })` call reskins *everything*: vuecs primitives **and** every library that builds on them.

Plus the runtime extras most design systems make you assemble yourself:

- 🌗 **Dark mode** — token-driven `.dark` flips via `useColorMode()` (`light` / `dark` / `system`), SSR-safe in Nuxt.
- 🎨 **Runtime palette switching** — `useColorPalette().set({ primary: 'emerald' })` re-tints every component *and* native Bootstrap/Bulma widgets, live, with no rebuild.
- 🌍 **Locale plumbing** — browser-detected, cookie/storage-persisted locale source that bridges into every locale-aware component and composes with `vue-i18n` / any i18n library.
- 🧩 **Design tokens** (`@vuecs/design`) — OKLCH color scales, radius + motion primitives, consumable with Tailwind, Bootstrap, Bulma, or no framework at all.

## Getting Started

```bash
npm install @vuecs/core @vuecs/button @vuecs/theme-tailwind @vuecs/design @vuecs/icon @vuecs/icons-lucide
```

```ts
import { createApp } from 'vue';
import vuecs, { extend } from '@vuecs/core';
import button from '@vuecs/button';
import tailwind from '@vuecs/theme-tailwind';
import lucide from '@vuecs/icons-lucide';

const app = createApp(App);

app.use(vuecs, {
    themes: [tailwind()],     // CSS class strings for every component
    icons:  [lucide()],       // Iconify names for every semantic icon slot
    overrides: {
        elements: {
            button: { classes: { root: extend('shadow-lg') } },  // merge on top of the theme
        },
    },
});
app.use(button);
```

```vue
<VCButton color="primary" variant="solid" icon-left="lucide:plus" :loading="busy">
    Create
</VCButton>
```

Follow the full walkthrough at **[vuecs.dev/getting-started](https://vuecs.dev/getting-started/)**.

## How theming works

Every component resolves its CSS classes through four layers, then applies structured variants on top:

```text
┌─────────────────────────────────────────────┐
│ 4. instance prop      :theme-class          │  per-component override
│ 3. overrides          app.use(vuecs, {...}) │  app-wide override
│ 2. themes             tailwind(), custom()  │  merged in array order
│ 1. component defaults vc-* structural       │  always preserved
└─────────────────────────────────────────────┘
            ↓ then variants resolve
   :theme-variant="{ color: 'error', size: 'sm' }"
```

Higher layers replace by default; wrap a value in `extend()` to merge instead. Themes are **pure data** — functions returning `{ elements, classesMergeFn? }` — so they compose, stack, and ship from third-party packages. `defineTheme({ extends: tailwindTheme(), elements: { ... } })` lets you publish a self-contained brand theme that inherits a shipped one.

→ Deep dive: [Theme system](https://vuecs.dev/guide/theme-system) · [Variants](https://vuecs.dev/guide/variants) · [Composing themes](https://vuecs.dev/guide/composing-themes) · [Build a themable component](https://vuecs.dev/guide/build-themable-component)

## Runtime superpowers

```ts
import { useColorMode, useColorPalette } from '@vuecs/design';

const { mode, resolved, toggle } = useColorMode();        // 'light' | 'dark' | 'system', persisted
const { set } = useColorPalette();                        // re-tint the whole app at runtime
set({ primary: 'emerald', info: 'cyan' });                // no rebuild, persists across reloads
```

```ts
import { useLocaleManager } from '@vuecs/locale';

const { set, reset, resolved } = useLocaleManager();
set('de-DE');   // apply a backend-saved preference
reset();        // back to 'auto' → browser language
```

In Nuxt, all three (color mode, palette, locale) ship as SSR-safe, cookie-backed plugins via [`@vuecs/nuxt`](./packages/nuxt) — rendered into the head before first paint, so there's no flash of the wrong theme.

## Packages

### Foundation

| Package | Version | Description |
|---|---|---|
| [`@vuecs/core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@vuecs/core?label=)](https://www.npmjs.com/package/@vuecs/core) | Theme resolution engine, variants, behavioral defaults, cross-cutting config, headless composables, `VCPrimitive` |
| [`@vuecs/design`](./packages/design) | [![npm](https://img.shields.io/npm/v/@vuecs/design?label=)](https://www.npmjs.com/package/@vuecs/design) | CSS design tokens (OKLCH), dark mode, motion primitives, runtime palette engine |
| [`@vuecs/icon`](./packages/icon) | [![npm](https://img.shields.io/npm/v/@vuecs/icon?label=)](https://www.npmjs.com/package/@vuecs/icon) | `<VCIcon>` — Iconify-backed icon component |
| [`@vuecs/locale`](./packages/locale) | [![npm](https://img.shields.io/npm/v/@vuecs/locale?label=)](https://www.npmjs.com/package/@vuecs/locale) | Browser-language-aware, resettable locale source |

### Components

| Package | Version | Description |
|---|---|---|
| [`@vuecs/button`](./packages/button) | [![npm](https://img.shields.io/npm/v/@vuecs/button?label=)](https://www.npmjs.com/package/@vuecs/button) | Button with `variant` × `color` × `size` axes, loading state, icon slots |
| [`@vuecs/elements`](./packages/elements) | [![npm](https://img.shields.io/npm/v/@vuecs/elements?label=)](https://www.npmjs.com/package/@vuecs/elements) | Atomic elements — Badge, Tag, Avatar, Separator, plus the Card / Alert / Collapse compounds |
| [`@vuecs/forms`](./packages/forms) | [![npm](https://img.shields.io/npm/v/@vuecs/forms?label=)](https://www.npmjs.com/package/@vuecs/forms) | Complete form-input family on Reka primitives — input, select, slider, pin, tags, … |
| [`@vuecs/table`](./packages/table) | [![npm](https://img.shields.io/npm/v/@vuecs/table?label=)](https://www.npmjs.com/package/@vuecs/table) | Compound table — columns/data driver, multi-sort, selection, expandable rows |
| [`@vuecs/list`](./packages/list) | [![npm](https://img.shields.io/npm/v/@vuecs/list?label=)](https://www.npmjs.com/package/@vuecs/list) | Compound list with `defineList()` state factory and ARIA-listbox selection |
| [`@vuecs/overlays`](./packages/overlays) | [![npm](https://img.shields.io/npm/v/@vuecs/overlays?label=)](https://www.npmjs.com/package/@vuecs/overlays) | Modal, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Toast |
| [`@vuecs/navigation`](./packages/navigation) | [![npm](https://img.shields.io/npm/v/@vuecs/navigation?label=)](https://www.npmjs.com/package/@vuecs/navigation) | Multi-level navigation with reactive registry, plus `<VCStepper>` |
| [`@vuecs/pagination`](./packages/pagination) | [![npm](https://img.shields.io/npm/v/@vuecs/pagination?label=)](https://www.npmjs.com/package/@vuecs/pagination) | Offset/limit pagination on Reka's Pagination primitives |
| [`@vuecs/placeholder`](./packages/placeholder) | [![npm](https://img.shields.io/npm/v/@vuecs/placeholder?label=)](https://www.npmjs.com/package/@vuecs/placeholder) | Skeleton loading primitives — wave/glow shimmer, reduced-motion aware |
| [`@vuecs/countdown`](./packages/countdown) | [![npm](https://img.shields.io/npm/v/@vuecs/countdown?label=)](https://www.npmjs.com/package/@vuecs/countdown) | Countdown timer with typed scoped slot |
| [`@vuecs/gravatar`](./packages/gravatar) | [![npm](https://img.shields.io/npm/v/@vuecs/gravatar?label=)](https://www.npmjs.com/package/@vuecs/gravatar) | Gravatar avatar with fallback support |
| [`@vuecs/link`](./packages/link) | [![npm](https://img.shields.io/npm/v/@vuecs/link?label=)](https://www.npmjs.com/package/@vuecs/link) | Router-aware anchor — NuxtLink / RouterLink / `<a>` auto-detection |
| [`@vuecs/timeago`](./packages/timeago) | [![npm](https://img.shields.io/npm/v/@vuecs/timeago?label=)](https://www.npmjs.com/package/@vuecs/timeago) | Relative-time display, locale-aware, auto-updating |

### Themes

| Package | Version | Description |
|---|---|---|
| [`@vuecs/theme-tailwind`](./themes/tailwind) | [![npm](https://img.shields.io/npm/v/@vuecs/theme-tailwind?label=)](https://www.npmjs.com/package/@vuecs/theme-tailwind) | Tailwind v4 utility classes + `twMerge`-backed `extend()` + palette runtime |
| [`@vuecs/theme-bootstrap`](./themes/bootstrap) | [![npm](https://img.shields.io/npm/v/@vuecs/theme-bootstrap?label=)](https://www.npmjs.com/package/@vuecs/theme-bootstrap) | Bootstrap 5 classes + `--bs-*` ↔ `--vc-color-*` design-token bridge |
| [`@vuecs/theme-bulma`](./themes/bulma) | [![npm](https://img.shields.io/npm/v/@vuecs/theme-bulma?label=)](https://www.npmjs.com/package/@vuecs/theme-bulma) | Bulma 1.0+ classes + `--bulma-*` bridge + palette renderer |

### Icon presets

| Package | Version | Description |
|---|---|---|
| [`@vuecs/icons-lucide`](./icons/lucide) | [![npm](https://img.shields.io/npm/v/@vuecs/icons-lucide?label=)](https://www.npmjs.com/package/@vuecs/icons-lucide) | Lucide icon names for every semantic icon slot |
| [`@vuecs/icons-font-awesome`](./icons/font-awesome) | [![npm](https://img.shields.io/npm/v/@vuecs/icons-font-awesome?label=)](https://www.npmjs.com/package/@vuecs/icons-font-awesome) | Font Awesome 6 Solid icon names |

### Integrations

| Package | Version | Description |
|---|---|---|
| [`@vuecs/nuxt`](./packages/nuxt) | [![npm](https://img.shields.io/npm/v/@vuecs/nuxt?label=)](https://www.npmjs.com/package/@vuecs/nuxt) | Theme-agnostic Nuxt module — SSR-safe color mode, palette & locale, auto-imports |

## Pick your stack

vuecs doesn't assume Tailwind. Each shipping theme pairs with the CSS stack you already use:

```css
/* Tailwind app */
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/theme-tailwind";

/* Bootstrap app — no Tailwind anywhere */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/design/standalone";
@import "@vuecs/theme-bootstrap";

/* Bulma app — no Tailwind anywhere */
@import "bulma/css/bulma.css";
@import "@vuecs/design/standalone";
@import "@vuecs/theme-bulma";
```

The Bootstrap and Bulma themes additionally bridge their framework's native CSS variables (`--bs-*`, `--bulma-*`) onto vuecs design tokens — so runtime palette switching re-tints *native* Bootstrap/Bulma widgets too, not just vuecs components.

## Example apps

Four runnable apps under [`examples/`](./examples), all mounting the **same demo views** from a shared catalog — living proof that one codebase reskins across ecosystems:

| App | Stack |
|---|---|
| [`examples/nuxt`](./examples/nuxt) | Nuxt 4 + Tailwind theme — SSR color mode, palette & locale |
| [`examples/tailwind`](./examples/tailwind) | Vite + Vue 3 + Tailwind theme |
| [`examples/bootstrap`](./examples/bootstrap) | Vite + Vue 3 + Bootstrap 5 |
| [`examples/bulma`](./examples/bulma) | Vite + Vue 3 + Bulma 1.0+ |

A Playwright visual-regression matrix (3 themes × every demo route) guards against unintended drift.

## Contributing

```bash
npm ci             # install
npm run build      # build all packages (Nx, cached)
npm run test       # run tests
npm run lint       # ESLint — must pass with zero errors
```

Commits follow [Conventional Commits](https://conventionalcommits.org); releases are fully automated via release-please.

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
