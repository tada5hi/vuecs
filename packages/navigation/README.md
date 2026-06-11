# @vuecs/navigation

[![npm version](https://img.shields.io/npm/v/@vuecs/navigation)](https://www.npmjs.com/package/@vuecs/navigation)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**Multi-level navigation for Vue 3**, part of [vuecs](https://github.com/tada5hi/vuecs). Each `<VCNavItems>` owns its items via a `:data` prop (plain array, sync fn, or async resolver), and dependent navs coordinate through a shared reactive registry — header tabs that swap a sidebar with zero app wiring.

## ✨ What's inside

- 🗂️ **`:data`-driven** — pass `NavigationItem[]`, a function, or an async resolver receiving `{ path, registry }`; reactive reads retrigger automatically, `refresh()` for imperative re-runs.
- 📡 **Reactive registry** — a nav publishes its resolved tree under a `registry-id`; other navs read it (`items`, `active`, `activeTrail`) and derive their own list. The canonical header → sidebar pattern.
- 🎯 **Three active concepts** — `active` (exact leaf, best path-score match), `activeWithin` (ancestor highlight + auto-open), `activeTrail` (root → leaf chain). Url-less items become click-driven section switchers.
- 📐 **Submenu modes** — `collapse` (inline Collapsible), `dropdown` (Reka NavigationMenu flyout), or `auto`; full arrow / Home / End keyboard navigation.
- 🧭 **Router-optional** — soft-reads vue-router's `$route` when present; works router-free with an explicit `:path`.
- 🪜 **`<VCStepper>` compound** — Stepper / Item / Trigger / Indicator / Title / Description / Separator on Reka's Stepper, for wizards and checkout flows, with linear-mode gating.

## 📦 Installation

```bash
npm install @vuecs/navigation
```

## ⚡ Usage

```vue
<VCNavItems
    :data="[
        { name: 'Dashboard', url: '/', icon: 'lucide:home' },
        {
            name: 'Settings',
            icon: 'lucide:settings',
            children: [
                { name: 'Profile', url: '/settings/profile' },
                { name: 'Security', url: '/settings/security' },
            ],
        },
    ]"
/>
```

```vue
<!-- dependent navs: top bar publishes, sidebar derives -->
<VCNavItems :data="topItems" registry registry-id="top" />
<VCNavItems :data="({ registry }) => registry('top').active.value[0]?.children ?? []" />
```

## 📚 Documentation

[Navigation component](https://vuecs.dev/components/navigation) · [Navigation guide](https://vuecs.dev/guide/navigation) · [Stepper](https://vuecs.dev/components/stepper)

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
