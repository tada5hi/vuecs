# @vuecs/core

[![npm version](https://img.shields.io/npm/v/@vuecs/core)](https://www.npmjs.com/package/@vuecs/core)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The engine of [vuecs](https://github.com/tada5hi/vuecs)** — a layered theme-resolution system, structured variants, behavioral defaults, and cross-cutting config for Vue 3. Every vuecs component package (and any third-party library that wants to be reskinnable through the same `app.use()` call) is built on it.

## ✨ What's inside

- 🎨 **Theme system** — CSS classes resolve through four layers (component defaults → themes → overrides → instance prop), with `extend()` to merge instead of replace. Pure resolution functions, zero Vue dependency, fully unit-testable.
- 🧬 **Variant system** — declarative `variants` / `compoundVariants` / `defaultVariants` (cva-style), merged across all theme layers. `<VCButton :theme-variant="{ color: 'error', size: 'sm' }">`.
- 🧩 **`defineTheme()`** — compose a new theme on top of one or more existing themes (`extends: [a, b]`), so brand themes ship as single self-contained packages.
- ⚙️ **Behavioral defaults** — `useComponentDefaults()` resolves non-class props (button text, placeholders, icon names) through instance → global → hardcoded layers. Accepts `MaybeRef`, so `computed(() => t('actions.create'))` makes every default i18n-reactive.
- 🌐 **Cross-cutting config** — `useConfig()` + `<VCConfigProvider>` for app-wide or subtree-scoped state (`dir`, `locale`, theme-augmented keys like `nonce`). `useLocale()` reads the active BCP-47 locale anywhere.
- 🪶 **Headless composables** — `useForwardProps`, `useForwardExpose`, `useArrowNavigation`, `useTypeahead`, `useStateMachine`, `useSelectionMachine`, `useId`, and more — ported in-tree so core stays **zero-dep beyond Vue 3**.
- 🧱 **`VCPrimitive`** — the `as` / `asChild` rendering building block, so downstream libraries get polymorphic elements without a `reka-ui` dependency.
- 🔍 **`auditTheme()`** — CI-friendly drift detection comparing any theme against the component-defaults catalog.
- 🛡️ **Typed end-to-end** — `ThemeElements`, `ComponentDefaults`, and `Config` are augmentable interfaces; component packages register themselves via declaration merging, giving you autocomplete + typo detection inside `app.use(vuecs, { ... })`.

## 📦 Installation

```bash
npm install @vuecs/core
```

## ⚡ Usage

Configure everything in one place:

```ts
import vuecs, { extend } from '@vuecs/core';
import tailwind from '@vuecs/theme-tailwind';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    themes: [tailwind()],
    icons:  [lucide()],
    overrides: {
        elements: {
            button: { classes: { root: extend('shadow-lg') } },
        },
    },
    defaults: {
        formSelect: { placeholder: '-- Select --' },
    },
    config: { locale: 'de-DE' },
});
```

Author your own themable component with the same machinery vuecs uses internally:

```ts
import { defineComponent, h } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';

export default defineComponent({
    name: 'MyChip',
    props: {
        color: { type: String, default: undefined },
        ...themableProps<{ root: string }>(),
    },
    setup(props, { slots }) {
        const theme = useComponentTheme('myChip', useThemeProps(props, 'color'), {
            classes: { root: 'my-chip' },
        });
        return () => h('span', { class: theme.value.root }, slots.default?.());
    },
});
```

## 📚 Documentation

- **[Theme system](https://vuecs.dev/guide/theme-system)** — layers, `extend()`, merge semantics
- **[Variants](https://vuecs.dev/guide/variants)** — variant axes + compound variants
- **[Composing themes](https://vuecs.dev/guide/composing-themes)** — `defineTheme()` / `mergeThemes()`
- **[Behavioral defaults](https://vuecs.dev/guide/behavioral-defaults)** — i18n-friendly global defaults
- **[Headless composables](https://vuecs.dev/guide/composables)** · **[VCPrimitive](https://vuecs.dev/guide/primitive)**
- **[Build a themable component](https://vuecs.dev/guide/build-themable-component)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
