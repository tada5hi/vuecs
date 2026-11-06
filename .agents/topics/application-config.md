# Cross-cutting Config

The third manager alongside theme and defaults. Carries cross-cutting state
that vuecs components (and future RTL-aware features) need to read at runtime.

```
@vuecs/core/src/config/
  types.ts       <- Config (augmentable interface), ConfigManagerOptions, Direction
  manager.ts     <- ConfigManager (shallowRef state, withDefaults(), per-instance defaults map)
  install.ts     <- installConfigManager(app, options) / provideConfigManager(manager) / injectConfigManager()
  composable.ts  <- useConfig(key) — reactive ComputedRef<Config[K] | undefined>;
                    useConfig(key, fallback) overload returns NonNullable<Config[K]>
  provider/
    Provider.vue <- <VCConfigProvider> SFC for subtree-scoped config
```

### Federated schema (declaration merging)

`Config` is an empty-by-default augmentable **interface** (mirrors
`ThemeElements` and `ComponentDefaults`). Core declares only the truly
cross-cutting keys:

```ts
// @vuecs/core/src/config/types.ts
export interface Config {
    dir?: Direction;       // 'ltr' | 'rtl'
    locale?: string;       // BCP-47 — read via useLocale(); source-agnostic (MaybeRef)
}
```

`locale` is consumed today by `useLocale()` (core) and locale-aware
components (`@vuecs/timeago`). See [Locale](locale.md).

Child packages augment via TypeScript declaration merging AND register
runtime defaults via `manager.withDefaults()`:

| Package | Augments | `withDefaults` registers |
|---|---|---|
| `@vuecs/core` | `dir`, `locale` | `dir: 'ltr'`, `locale: 'en-US'` |
| `@vuecs/theme-tailwind` | `nonce` (CSP nonce for `setColorPalette`'s `<style>`) | none — no sensible default |
| `@vuecs/overlays` | `scrollLockTarget` (selector / element receiving scroll-lock) | `scrollLockTarget: 'body'` |

Each augmentation lives in `<package>/src/config.ts`, side-effect imported
from the package's `index.ts` so the augmentation loads whenever the
package is depended on. Augmentations need a type-only anchor import
(`import type {} from '@vuecs/core'`) so TypeScript can resolve the target
module. Each augmenting package adds `@vuecs/core` as a `devDependency`
(type-only — no runtime cost beyond the existing peer dep).

### Resolution order

```
1. Consumer config (setConfig / install options / <VCConfigProvider :config>)
2. Registered defaults (withDefaults from child packages + CORE_DEFAULTS)
3. undefined
```

`useConfig(key)` returns `Config[K] | undefined` (honest — augmented keys
may have no default). The overload `useConfig(key, fallback)` returns
`NonNullable<Config[K]>` when a fallback is provided, mirroring how
`useComponentDefaults`'s `hardcoded` arg works.

Values may be `MaybeRef`, so reactive sources (e.g. `useLocale()` from an
i18n integration) unwrap transparently via Vue's `isRef`/`unref` (NOT a
`'value' in raw` heuristic — that would accidentally unwrap any object
with a `.value` property like `HTMLInputElement`).

### Subtree scoping with `<VCConfigProvider>`

Two ways to install config:

```ts
// App-level (most common)
app.use(vuecs, { config: { dir: 'rtl' } });

// Subtree-scoped (for an RTL block in an LTR app, etc.)
<VCConfigProvider :config="{ dir: 'rtl' }">
    <RestOfSubtree />
</VCConfigProvider>
```

`<VCConfigProvider>` creates a child `ConfigManager` and **inherits the
parent's defaults at mount time** (snapshot, not reactive). Calls to
`withDefaults` inside the subtree affect only the local manager — the
parent stays untouched. The component uses Vue's raw `provide` (bypassing
vuecs's `provide` helper, which short-circuits on existing keys) so it
properly overrides the parent inject.

Mirrors Reka UI's `<ConfigProvider>` shape but layered on top of the
manager pattern (you get both the install API for global config AND the
component API for subtree overrides).
