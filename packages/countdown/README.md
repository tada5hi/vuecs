# @vuecs/countdown

[![npm version](https://img.shields.io/npm/v/@vuecs/countdown)](https://www.npmjs.com/package/@vuecs/countdown)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**`<VCCountdown>` — a precise countdown timer for Vue 3**, part of [vuecs](https://github.com/tada5hi/vuecs). Renderless by default: you get a fully-typed scoped slot with every time unit and build whatever display you want around it.

## ✨ What's inside

- ⏱️ **Typed scoped slot** — `days` / `hours` / `minutes` / `seconds` / `milliseconds` plus `totalDays` … `totalMilliseconds` and `isCounting`, all exported as `CountdownSlotProps`.
- ▶️ **Lifecycle events** — `start`, `progress`, `abort`, `end` (opt out via `:emit-events="false"`).
- 🚀 **Auto-start** — begins on mount by default (`:auto-start`); restart by re-binding `:time`.
- 🎚️ **Tunable tick** — `:interval` (default 1000 ms) and an injectable `:now` function for deterministic tests.
- 🏷️ **Polymorphic + themeable** — `:tag` to change the host element; theme via the `countdown` element key.

## 📦 Installation

```bash
npm install @vuecs/countdown
```

## ⚡ Usage

```vue
<VCCountdown :time="2 * 60 * 60 * 1000" @end="onExpired">
    <template #default="{ hours, minutes, seconds }">
        Offer expires in {{ hours }}h {{ minutes }}m {{ seconds }}s
    </template>
</VCCountdown>
```

## 📚 Documentation

Full reference + live demo: **[vuecs.dev/components/countdown](https://vuecs.dev/components/countdown)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
