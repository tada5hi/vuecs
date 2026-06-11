# @vuecs/gravatar

[![npm version](https://img.shields.io/npm/v/@vuecs/gravatar)](https://www.npmjs.com/package/@vuecs/gravatar)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**`<VCGravatar>` — Gravatar avatars for Vue 3**, part of [vuecs](https://github.com/tada5hi/vuecs). Hashes the email client-side, builds the Gravatar URL, and renders through `<VCAvatar>` so you get graceful fallback content for free.

## ✨ What's inside

- 📧 **`email` or precomputed `hash`** — pass either; hashing happens for you.
- 🖼️ **Fallback support** — composes `<VCAvatar>` from `@vuecs/elements`: broken/missing images fall back to your `#fallback` slot (initials, icon, …).
- ⚙️ **Full Gravatar API surface** — `size`, `defaultImg` (`retro` by default), `rating`, custom `hostname` / `protocol` for self-hosted proxies.
- 📐 **Display sizing** — `displaySize` (`sm` / `md` / `lg`) maps onto the avatar's theme variant, independent of the fetched pixel `size`.

## 📦 Installation

```bash
npm install @vuecs/gravatar
```

## ⚡ Usage

```vue
<VCGravatar email="user@example.com" :size="160" display-size="lg">
    <template #fallback>JD</template>
</VCGravatar>
```

## 📚 Documentation

Full reference + live demo: **[vuecs.dev/components/gravatar](https://vuecs.dev/components/gravatar)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
