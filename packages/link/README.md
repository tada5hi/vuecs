# @vuecs/link

[![npm version](https://img.shields.io/npm/v/@vuecs/link)](https://www.npmjs.com/package/@vuecs/link)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**`<VCLink>` — one anchor for every routing setup**, part of [vuecs](https://github.com/tada5hi/vuecs). Detects the environment and renders `<NuxtLink>`, `<RouterLink>`, or a plain `<a>` — so library components (and your own) never hard-code a router.

## ✨ What's inside

- 🧭 **Auto-detection** — Nuxt → `<NuxtLink>`, vue-router → `<RouterLink>`, neither → `<a>`. No configuration, no direct router dependency.
- 🔗 **`to` or `href`** — route location object/string for router navigation, `href` for plain anchors; `query` merging included.
- 🚦 **Stateful props** — `active` and `disabled` flow into rendering and clicks; `clicked` emit for selection-style flows (used by `@vuecs/navigation`'s url-less section switchers).
- ⚡ **Prefetch control** — `:prefetch` forwarded to `<NuxtLink>` (default `true`).

## 📦 Installation

```bash
npm install @vuecs/link
```

## ⚡ Usage

```vue
<VCLink to="/dashboard">Dashboard</VCLink>
<VCLink href="https://github.com/tada5hi/vuecs" target="_blank">GitHub</VCLink>
<VCLink :to="{ name: 'user', params: { id } }" :disabled="!canVisit">Profile</VCLink>
```

## 📚 Documentation

Full reference: **[vuecs.dev/components/link](https://vuecs.dev/components/link)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
