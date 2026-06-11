# @vuecs/pagination

[![npm version](https://img.shields.io/npm/v/@vuecs/pagination)](https://www.npmjs.com/package/@vuecs/pagination)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**`<VCPagination>` — offset/limit pagination for Vue 3**, part of [vuecs](https://github.com/tada5hi/vuecs). Built on [Reka UI](https://reka-ui.com)'s Pagination primitives for the accessibility heavy lifting; speaks the same `total` / `limit` / `offset` language as your API.

## ✨ What's inside

- 🔢 **API-shaped props** — `:total`, `:limit`, `:offset`; a single `@load` emit hands you the next offset + meta for your fetch call.
- 🧮 **Smart page windows** — `sibling-count` and `show-edges` control truncation with ellipsis; `hide-disabled` trims unusable prev/next.
- 🖼️ **Iconified controls** — first / prev / next / last icons resolve through vuecs's icon presets (`@vuecs/icons-lucide`, `@vuecs/icons-font-awesome`) or per-instance props; labels overridable for i18n via behavioral defaults.
- ⏳ **Busy-aware** — `:busy` suppresses interaction during loads.
- 🎨 **Variant axes** — `variant` (`outline` / `soft` / `ghost`) × `size` (`sm` / `md` / `lg`) across all shipping themes.

## 📦 Installation

```bash
npm install @vuecs/pagination
```

## ⚡ Usage

```vue
<VCPagination
    :total="meta.total"
    :limit="meta.limit"
    :offset="meta.offset"
    :busy="loading"
    @load="(data) => fetchPage(data)"
/>
```

## 📚 Documentation

Full reference + live demo: **[vuecs.dev/components/pagination](https://vuecs.dev/components/pagination)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
