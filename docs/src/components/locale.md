# Locale

`@vuecs/locale` is a small, browser-language-aware **locale source** for
vuecs. It detects the navigator language, lets you apply an explicit
override (e.g. a backend-saved user preference), and `reset()` back to the
default. The resolved value is bridged into `@vuecs/core`'s cross-cutting
config, so [`useLocale()`](#reading-the-locale) and every locale-aware
component (such as [Timeago](/components/timeago)) read the same value.

It is the locale analog of [color mode](/getting-started/dark-mode): the
source is either an explicit BCP-47 tag or the `'auto'` sentinel (the
counterpart of color-mode's `'system'`), which defers to the browser.

```bash
npm install @vuecs/locale
```

## Setup

```ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import locale from '@vuecs/locale';

const app = createApp(App);
app.use(vuecs);
app.use(locale, {
    initial: 'auto',     // 'auto' detects the browser language
    fallback: 'en-US',   // used when navigator language is unavailable (SSR)
    persist: true,       // remember the source in localStorage
});
```

::: tip SSR / Nuxt
The `app.use(locale)` plugin persists to `localStorage`, which is
client-only — fine for SPAs. **For SSR, use [`@vuecs/nuxt`](/nuxt/),
which ships a cookie-backed, SSR-safe locale integration** (see
[below](#ssr-with-nuxt)). Outside Nuxt, pass a cookie-backed `Ref` to
[`bindLocale`](#building-block) yourself.
:::

## Applying and resetting an override

The canonical flow: a user's locale is stored in your backend, applied on
login, and resettable back to the browser default.

```ts
import { useLocaleManager } from '@vuecs/locale';

const { set, reset, source, resolved, isAuto } = useLocaleManager();

// after login — apply the saved preference
set(user.preferences.locale); // e.g. 'de-DE'

// "reset to default" button
reset();                      // source → 'auto' → browser language → fallback

console.log(resolved.value);  // the concrete BCP-47 tag in effect
console.log(isAuto.value);    // true when deferring to the browser
```

## Reading the locale

Component authors should read the locale via `useLocale()` from
`@vuecs/core` — it works whether or not `@vuecs/locale` is installed
(falling back to the config default `en-US`):

```ts
import { useLocale } from '@vuecs/core';

const locale = useLocale(); // ComputedRef<string>
```

## Without the plugin

You don't need `@vuecs/locale` at all if you already manage locale
elsewhere. `Config['locale']` accepts a `MaybeRef`, so feed it any reactive
source — `vue-i18n`'s locale, your own store, or `@vueuse/core` directly:

```ts
import { useNavigatorLanguage } from '@vueuse/core';

const { language } = useNavigatorLanguage();
app.use(vuecs, { config: { locale: language } });
```

`@vuecs/locale` exists to add the **override + reset + persistence**
machinery on top of that bare wiring.

## SSR with Nuxt

[`@vuecs/nuxt`](/nuxt/) ships a cookie-backed, SSR-safe locale integration —
enabled by default. The cookie is the SSR transport, so a concrete saved
locale renders identically on server and client (no hydration mismatch).
When the source is `'auto'`, the server resolves it from the request's
`Accept-Language` header and the client from `navigator.language`.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@vuecs/nuxt'],
    vuecs: {
        locale: { value: 'auto', fallback: 'en-US' }, // or `false` to opt out
    },
});
```

```vue
<script setup lang="ts">
// auto-imported by @vuecs/nuxt
const locale = useLocale();             // ComputedRef<string> (read)
const { set, reset } = useLocaleManager(); // control
</script>
```

The module bridges the resolved locale into `Config['locale']` and emits
`<html lang>` before first paint. Cookie attributes come from
`vuecs.localeCookie` (falling back to `vuecs.cookie`).

## Using with an i18n library (ilingo / vue-i18n)

vuecs doesn't translate strings — it only resolves the active **locale
value**. Your i18n library owns the translations. They compose through the
shared `Config['locale']`.

**If your i18n library owns the locale** (the common case — e.g.
[`@ilingo/vue`](https://github.com/tada5hi/ilingo) exposes a reactive
`injectLocale()` ref, as used in
[authup](https://github.com/tada5hi/authup)), feed that ref straight into
vuecs — no `@vuecs/locale` needed:

```ts
import { injectLocale } from '@ilingo/vue';

const locale = injectLocale();            // reactive Ref<string>
app.use(vuecs, { config: { locale } });   // useLocale() now mirrors ilingo
```

That single line replaces a per-component `watch(locale, …)` fan-out:
`@vuecs/timeago` (and any future locale-aware vuecs component) follows the
i18n locale automatically.

**If you want `@vuecs/locale` to own the locale** (browser detection +
reset) and have it drive ilingo, push `resolved` into ilingo's reactive
locale ref:

```ts
import { useLocaleManager } from '@vuecs/locale';
import { injectLocale } from '@ilingo/vue';

const { resolved } = useLocaleManager();
const ilingoLocale = injectLocale();
watch(resolved, (l) => { ilingoLocale.value = l; }, { immediate: true });
```

> Drive `@ilingo/vue`'s reactive ref (`injectLocale().value = l`), **not**
> the core `ilingo.setLocale()` — the Vue adapter tracks the ref, so
> assigning it is what re-renders translations.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initial` | `string \| 'auto'` | `'auto'` | Initial source; also the target `reset()` returns to |
| `fallback` | `string` | `'en-US'` | Concrete tag used when `'auto'` and no navigator language |
| `persist` | `boolean` | `true` | Persist the source to localStorage |
| `storageKey` | `string` | `'vc-locale'` | localStorage key when `persist` is on |
| `syncLang` | `boolean` | `true` | Mirror the resolved locale onto `<html lang>` |

## Building block

`bindLocale(source, options)` is the lower-level primitive (parallels
`bindColorMode` from `@vuecs/design`). Pass it any `Ref<LocaleSource>` —
for example a cookie-backed ref for SSR-aware persistence — and it returns
the same `{ source, resolved, isAuto, set, reset }` surface without the
plugin's storage or config bridge.

## See also

- [Timeago](/components/timeago) — consumes the active locale
- [Dark mode](/getting-started/dark-mode) — the color-mode analog
