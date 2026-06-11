# @vuecs/locale

[![npm version](https://img.shields.io/npm/v/@vuecs/locale)](https://www.npmjs.com/package/@vuecs/locale)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**Browser-language-aware, resettable locale source for [vuecs](https://github.com/tada5hi/vuecs).** Detects the navigator language, accepts an explicit override (e.g. a backend-saved user preference), resets back to `'auto'` — and bridges the resolved BCP-47 tag into `@vuecs/core`'s config so `useLocale()` and every locale-aware component pick it up reactively.

## ✨ What's inside

- 🌍 **`'auto'` sentinel** — the locale analog of color mode's `'system'`: defers to the browser language (via `@vueuse/core`'s `useNavigatorLanguage`), with a configurable fallback.
- 🔁 **`useLocaleManager()`** — `set(locale)` applies an override, `reset()` hands resolution back to the browser; `source` / `resolved` / `isAuto` expose the state reactively.
- 💾 **Persistence** — the chosen source survives reloads via `localStorage` (`vc-locale` by default).
- 🏷️ **`<html lang>` sync** — the resolved tag is mirrored onto the document automatically.
- 🧩 **Single source of truth** — bridges into `Config['locale']`, so read-side consumers (`useLocale()` from `@vuecs/core`, `<VCTimeago>`, …) need zero wiring and work even without this package installed.
- 🛠️ **`bindLocale()`** — the lower-level building block (parallels `bindColorMode`) for custom sources; `@vuecs/nuxt` uses it with a cookie-backed ref for SSR.

## 📦 Installation

```bash
npm install @vuecs/locale
```

## ⚡ Usage

```ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import locale from '@vuecs/locale';

const app = createApp(App);
app.use(vuecs);
app.use(locale, { initial: 'auto', fallback: 'en-US' });
```

```ts
// after login — apply the backend-saved preference
import { useLocaleManager } from '@vuecs/locale';

const { set, reset, resolved, isAuto } = useLocaleManager();
set(user.preferences.locale);   // e.g. 'de-DE'
reset();                        // back to 'auto' → browser language
```

```ts
// read-only consumption — works with or without this plugin
import { useLocale } from '@vuecs/core';

const locale = useLocale();     // ComputedRef<string>
```

**Using `vue-i18n` or another i18n library?** Let it own the locale and feed its ref into `app.use(vuecs, { config: { locale } })` instead — vuecs resolves the locale *value*; your i18n library owns the translations. Both directions compose; see the docs for recipes.

## 📚 Documentation

Full reference + i18n composition recipes: **[vuecs.dev/components/locale](https://vuecs.dev/components/locale)**

For SSR (cookie transport + `Accept-Language` resolution), use [`@vuecs/nuxt`](https://vuecs.dev/nuxt/).

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
