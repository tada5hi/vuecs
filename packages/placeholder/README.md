# @vuecs/placeholder

[![npm version](https://img.shields.io/npm/v/@vuecs/placeholder)](https://www.npmjs.com/package/@vuecs/placeholder)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**Skeleton loading primitives for [vuecs](https://github.com/tada5hi/vuecs)** — the "shimmer" pattern. Pure CSS, self-contained (renders visibly even without a theme), and accessible out of the box.

## ✨ What's inside

- 🦴 **`<VCPlaceholder>`** — a single animated bar. `shape` (`rect` / `pill` / `circle`), `size` (`xs`–`xl`), explicit `width`, and a per-instance `duration` override.
- 🔀 **`<VCPlaceholderWrapper>`** — conditional `#loading` ↔ `#default` switch with the W3C "Loading content" ARIA wiring (`aria-busy`, `role="status"`, `aria-live="polite"`) handled for you.
- 🎞️ **Three animation modes** — `wave` (moving gradient, default), `glow` (opacity pulse), `none`; `prefers-reduced-motion` disables animation automatically.
- 🏗️ **Composite skeletons live with their components** — `<VCCardPlaceholder>` ships in `@vuecs/elements`, `<VCTablePlaceholder>` in `@vuecs/table`; both are built from this package's primitives.

## 📦 Installation

```bash
npm install @vuecs/placeholder
```

## ⚡ Usage

```vue
<VCPlaceholderWrapper :loading="busy">
    <template #loading>
        <VCPlaceholder shape="circle" :width="48" />
        <VCPlaceholder size="lg" />
        <VCPlaceholder size="sm" width="60%" />
    </template>
    <template #default>
        <!-- real content -->
    </template>
</VCPlaceholderWrapper>
```

## 📚 Documentation

Full reference, shapes, and animation demos: **[vuecs.dev/components/placeholder](https://vuecs.dev/components/placeholder)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
