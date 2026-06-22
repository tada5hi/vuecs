# @vuecs/button

[![npm version](https://img.shields.io/npm/v/@vuecs/button)](https://www.npmjs.com/package/@vuecs/button)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**`<VCButton>` — the general-purpose button of [vuecs](https://github.com/tada5hi/vuecs).** A full `variant` × `color` × `size` matrix, loading state, and icon slots — visually defined entirely by whichever theme you install (Tailwind, Bootstrap, Bulma, or your own).

## ✨ What's inside

- 🎛️ **Variant matrix** — `variant` (`solid` / `outline` / `soft` / `ghost` / `link`) × `color` (`primary` / `neutral` / `success` / `warning` / `error` / `info`) × `size` (`sm` / `md` / `lg`), resolved through the vuecs variant system.
- ⏳ **Loading state** — `:loading` disables interaction and exposes `{ loading, disabled }` to the default slot for spinners or custom feedback.
- 🖼️ **Icon support** — `icon-left` / `icon-right` Iconify-name props (rendered via `<VCIcon>`) plus leading/trailing slots for full control.
- 🔗 **Polymorphic** — render as `button`, `a`, any tag, or a component (`RouterLink` / `NuxtLink`) via `:as`; native `type` forwarding for forms, `aria-disabled` for non-button targets.
- 📝 **`useSubmitButton()` companion** — `@vuecs/forms` ships an experimental composable that drives create/update submit buttons (text, icon, color) from global behavioral defaults.

## 📦 Installation

```bash
npm install @vuecs/button
```

## ⚡ Usage

```vue
<VCButton color="primary" icon-left="lucide:plus" :loading="busy" @click="create">
    Create
</VCButton>

<VCButton variant="outline" color="error" size="sm">Delete</VCButton>
<VCButton variant="ghost" as="a" href="/docs">Docs</VCButton>

<!-- button-styled router link -->
<VCButton :as="RouterLink" :to="`/clients/${id}`" color="primary" variant="outline" size="sm">
    Edit
</VCButton>
```

## 📚 Documentation

Full reference, live demos, and per-theme variant tables: **[vuecs.dev/components/button](https://vuecs.dev/components/button)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
