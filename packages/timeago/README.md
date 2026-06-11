# @vuecs/timeago

[![npm version](https://img.shields.io/npm/v/@vuecs/timeago)](https://www.npmjs.com/package/@vuecs/timeago)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**`<VCTimeago>` — live relative timestamps for Vue 3** ("3 minutes ago", "in 2 days"), part of [vuecs](https://github.com/tada5hi/vuecs). Locale-aware through vuecs's central locale config, auto-updating as time passes.

## ✨ What's inside

- 🕒 **Flexible input** — `:datetime` accepts `Date`, epoch number, or ISO string.
- 🔄 **Auto-update** — re-renders as the relative time changes; disable with `:auto-update="false"`.
- 🌍 **Locale-aware** — reads the app-wide locale via `useLocale()` from `@vuecs/core` (set it through `config: { locale }`, `@vuecs/locale`, or your i18n library); per-instance `:locale` prop wins. Register `date-fns` locales via `provideLocales`.
- 🧪 **Custom converter** — swap the formatting logic entirely via the `:converter` / `:converter-options` props.

## 📦 Installation

```bash
npm install @vuecs/timeago
```

## ⚡ Usage

```vue
<VCTimeago :datetime="post.createdAt" />
<VCTimeago :datetime="Date.now() - 60_000" locale="de-DE" />
```

## 📚 Documentation

Full reference + locale setup: **[vuecs.dev/components/timeago](https://vuecs.dev/components/timeago)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
