# Global Behavioral Defaults (#1491)

Alongside the theme system, `@vuecs/core` exposes a parallel `DefaultsManager` for
non-class behavioral props (button text, placeholder strings, visibility toggles,
content strings). This is the mechanism for i18n and project-wide customization
without per-instance overrides.

### Resolution order

For each resolved key, the composable walks three layers:

```
1. Instance prop (non-undefined)            ← highest priority
2. Global defaults (from app.use() config)  ← may be MaybeRef (ref / computed)
3. Hardcoded fallback (passed to composable) ← lowest priority
```

Global default values are wrapped via `MaybeRef`, so reactive sources
(`computed(() => t('actions.create'))`) unwrap transparently and the returned
`ComputedRef` recomputes on locale changes.

### Resolution contract (important for component authors)

Two rules govern what ends up on `defaults.value`:

- **`hardcoded` drives the shape.** The composable iterates `Object.keys(hardcoded)`;
  any global-default key that isn't listed in `hardcoded` is silently dropped.
  Treat the `hardcoded` object as the source of truth when adding new
  configurable keys — if you register a new key on `ComponentDefaults` via
  declaration merging, add it to `hardcoded` too.
- **Only `undefined` triggers fallthrough.** `null` on the instance prop wins
  over both global and hardcoded layers. This lets consumers deliberately
  "unset" a value, but means `null` cannot be used to toggle a boolean off
  (pass `false` instead).

### Composite components must forward `undefined`

When a composite component forwards behavioral props to a child component
whose prop is resolved via `useComponentDefaults`, the composite's own Vue
`prop.default` must be `undefined`. A composite with
`prop: { default: 'something' }` that forwards `something` to the child will
always win layer 1 on the child and shadow the child's global defaults.

The compound redesign of `@vuecs/list` eliminated this exact category of
forwarding (each part now reads from context directly), so there is no
in-tree example today. Reach for this pattern when wrapping a vuecs
component in your own composite that opts into the same behavioral-defaults
flow.

### Setup API

```typescript
import vuecs from '@vuecs/core';
import bootstrap from '@vuecs/theme-bootstrap';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    themes: [bootstrap()],
    icons: [lucide()],
    defaults: {
        submitButton: {
            createText: computed(() => t('actions.create')),
            updateText: 'Aktualisieren',
        },
        listEmpty: {
            content: 'Keine Einträge vorhanden...',
        },
        formSelect: {
            placeholder: '-- Auswählen --',
        },
    },
});
```

### Component consumption

Components drop Vue-level prop defaults (so `undefined` means "fall through") and
resolve via the composable. The same composable powers experimental
*standalone* hooks like `useSubmitButton()` in `@vuecs/forms` —
the only difference is that the "props" arg is an empty object so every
key falls through to the global defaults / hardcoded layer.

```typescript
const behavioralDefaults = { createText: 'Create', updateText: 'Update', createIcon: '' };

// Inside a Vue composable (no `setup` props):
const defaults = useComponentDefaults('submitButton', {}, behavioralDefaults);
// defaults.value.createText → reactive resolved value
```

### Key APIs

- **`DefaultsManager`** — Holds the `Partial<ComponentDefaults>` map in a `shallowRef`. Supports runtime updates via `setDefaults()`.
- **`installDefaultsManager(app, options)`** — Vue plugin that provides DefaultsManager via `app.provide()`. Called from the top-level `install()` in `@vuecs/core` and from every component package's `install()`.
- **`injectDefaultsManager()`** — Retrieves the DefaultsManager from Vue inject.
- **`useComponentDefaults(name, props, hardcoded)`** — Vue composable. Returns `ComputedRef<T>` that recomputes when props or DefaultsManager state change. Throws if the DefaultsManager is not installed.

### Type-Safe Component Defaults (ComponentDefaults)

`ComponentDefaults` is an empty augmentable interface with no index signature.
Each component package extends it via TypeScript declaration merging to register
its component name and typed default shape. Values are wrapped with
`ComponentDefaultValues<T>`, which maps each field to `MaybeRef<T[K] | undefined>`
so reactive and plain values are both accepted.

```typescript
// In @vuecs/core
export interface ComponentDefaults {}
export type ComponentDefaultValues<T> = {
    [K in keyof T]?: MaybeRef<T[K] | undefined>;
};

// In a component package (or composable module)
declare module '@vuecs/core' {
    interface ComponentDefaults {
        submitButton?: ComponentDefaultValues<SubmitButtonDefaults>;
    }
}
```

### Architecture

```
@vuecs/core/src/defaults/
  types.ts       <- ComponentDefaults (augmentable), ComponentDefaultValues<T>, DefaultsManagerOptions
  manager.ts     <- DefaultsManager class (shallowRef state, get() by component name)
  install.ts     <- installDefaultsManager() / injectDefaultsManager() — Vue provide/inject
  composable.ts  <- useComponentDefaults() — Vue composable; unref's MaybeRef values per key
```

The theme and defaults systems are intentionally decoupled: themes handle CSS
classes, defaults handle everything else. The top-level `CoreOptions` type and
`install()` function tie them together so consumers configure both in one call.

### Migrated components

The following components resolve the listed behavioral props via
`useComponentDefaults`:

| Component / hook | Keys |
|------------------|------|
| `useSubmitButton()` (`submitButton`) | `createText`, `updateText`, `createIcon`, `updateIcon`, `createColor`, `updateColor` |
| `VCFormSelect` | `placeholder` |
| `VCFormGroup` | `validation` |
| `VCFormCheckbox` | `labelContent` |
| `VCFormSwitch` | `labelContent` |
| `VCListEmpty` | `content` |
| `VCPagination` | `firstIcon`, `prevIcon`, `nextIcon`, `lastIcon`, `firstLabel`, `prevLabel`, `nextLabel`, `lastLabel` |

For these props the Vue `prop.default` is `undefined`; the effective default now
lives in the component's `behavioralDefaults` constant, which is passed to the
composable as the lowest-priority layer. The `submitButton` entry belongs to `useSubmitButton()` in `@vuecs/forms`, an experimental bind-object helper composed with `VCButton`; it has no corresponding standalone component.
