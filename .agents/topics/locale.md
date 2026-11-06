# Locale (@vuecs/core + @vuecs/locale)

Locale is modeled in **two layers**, deliberately split the same way
color-mode separates its resolver from its source:

- **Read side — `@vuecs/core`.** `locale` is a `Config` key (BCP-47,
  default `en-US`). `useLocale(fallback?)` is a thin `ComputedRef<string>`
  wrapper over `useConfig('locale', 'en-US')`. This is what components
  consume (`@vuecs/timeago`). It works with **no** locale package
  installed, and stays zero-dep (core takes no `@vueuse` dep). The *source*
  of the value is intentionally not core's concern — `Config['locale']`
  accepts a `MaybeRef`, so a consumer can feed it a static string, a
  `vue-i18n` locale ref, or `@vuecs/locale`'s navigator-backed source.

- **Source side — `@vuecs/locale`.** A small Layer-1 package (peers
  `@vuecs/core` + `@vueuse/core`) that owns browser-language detection +
  an override + reset. It does **not** live in `@vuecs/design` because
  locale is not a design-token concern — but it reuses the same
  `@vueuse/core` browser building blocks design uses.

### `@vuecs/locale` shape

The source value is `LocaleSource = string | 'auto'` — `'auto'` is the
locale analog of color-mode's `'system'` sentinel: it defers resolution
to `useNavigatorLanguage()`, falling back to a concrete tag (`en-US`).

```text
@vuecs/locale/src/
  constants.ts   <- AUTO_LOCALE ('auto'), DEFAULT_STORAGE_KEY ('vc-locale'),
                    LOCALE_MANAGER_SYMBOL (Symbol.for('VCLocaleManager'))
  types.ts       <- LocaleSource, BindLocaleOptions, LocaleOptions, UseLocaleReturn
  bind.ts        <- bindLocale(source, opts) building block (parallels bindColorMode):
                    resolved = override → navigator language → fallback;
                    isAuto; set()/reset(); syncs <html lang>
  install.ts     <- installLocale(app, opts): builds the source ref (useStorage when
                    persist), binds it, bridges resolved into Config via
                    installConfigManager(app, { config: { locale: resolved } }),
                    provides the handles
  composable.ts  <- useLocaleManager(): inject the provided handles (throws if not installed)
  index.ts       <- default Vue plugin + barrel
```

**Resolution / reset.** `set(locale)` writes an explicit override (e.g. a
backend-saved user preference). `reset()` returns the source to
`options.initial` (default `'auto'`), handing resolution back to the
browser language — the canonical "reset the backend configuration to the
default locale" path.

**Config bridge.** `installLocale` writes the resolved `ComputedRef` into
core's `ConfigManager` (`installConfigManager` merges, so install order
vs `app.use(vuecs)` doesn't matter). Because `ConfigManager.get()` unwraps
refs on every read and `useConfig`'s computed reads through that ref,
`set()` / `reset()` propagate to `useLocale()` and every consumer
reactively. The bridge is via the existing `Config['locale']` key — there
is no separate locale symbol on the read side, so there's a single source
of truth (no `@vuecs/list`-style cross-package symbol bridge needed).

`bindLocale()` is exported for advanced / SSR use — pass a cookie-backed
`Ref<LocaleSource>` (as used by the Nuxt integration) instead of the
plugin's `useStorage` source.

### Timeago locale integration

`@vuecs/timeago` reads `useLocale()` from core. Its per-instance `locale` prop overrides that value, and the plugin's locale install option feeds `Config['locale']` through `installConfigManager`. The `provideLocales` / `injectLocales` map translates locale tags to date-fns locale objects. The default locale is `en-US`.

For an i18n-owned reactive source, pass the locale ref into `app.use(vuecs, { config: { locale } })` once; do not mirror it through a second private locale channel.

### SSR dispatch (@vuecs/nuxt)

`@vuecs/nuxt` ships a **universal** locale plugin (server + client) —
mirrors the color-mode / palette SSR plugins but is NOT server-only,
because the `Config['locale']` bridge must exist even when the consumer
never calls `useLocaleManager()` (read-only consumers like `<VCTimeago>`
read `useLocale()` directly).

- **Source:** `useCookie<LocaleSource>(...)` — the cookie is the SSR
  transport. A concrete saved locale reads identically on server and
  client (no hydration mismatch — the canonical backend-saved-preference
  flow). `localeCookie` attributes fall back to `cookie`.
- **`'auto'` resolution:** the plugin injects `bindLocale`'s
  `navigatorLanguage` per environment — server reads the request's
  `Accept-Language` (`useRequestHeaders` → first tag), client uses
  `useNavigatorLanguage().language`. The residual one-frame mismatch is
  only possible in the no-preference (`'auto'`) case — same caveat class
  as color-mode's `'system'`.
- **Bridge + head:** calls `installLocale(nuxtApp.vueApp, { source, navigatorLanguage, … })`
  (which bridges `resolved` into Config + provides the manager handles),
  then `useHead({ htmlAttrs: { lang } })` on the server for first paint.
  `enforce: 'post'` so the user's `app.use(vuecs)` ran first.
- **Auto-imports:** `useLocale` (from core) + `useLocaleManager` (from
  `@vuecs/locale`) — the plugin provides the handles under the same
  `LOCALE_MANAGER_SYMBOL`, so `@vuecs/locale`'s `useLocaleManager()` works
  unchanged in Nuxt. Module option `locale: false` opts out (for apps
  whose i18n library owns the locale).

### Composition with i18n libraries

vuecs resolves the locale **value**; the i18n library owns the
**translations**. They compose through `Config['locale']` (a `MaybeRef`):

- **i18n owns locale** (authup / `@ilingo/vue`, `vue-i18n`): feed its
  reactive locale ref into `app.use(vuecs, { config: { locale } })`. Don't
  install `@vuecs/locale`. `useLocale()` mirrors it.
- **`@vuecs/locale` owns locale** (browser detect + reset): push
  `resolved` into the i18n library's reactive locale ref —
  `watch(resolved, l => { injectLocale().value = l })`. NB for ilingo:
  drive `@ilingo/vue`'s ref, NOT the core `ilingo.setLocale()` (the Vue
  adapter tracks the ref, not the core field).
