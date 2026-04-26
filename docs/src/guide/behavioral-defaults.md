# Behavioral Defaults

`@vuecs/core` ships a parallel resolution system for **non-class** behavioral props — button text, placeholders, content strings, visibility toggles. This is the i18n hook: configure default text once at `app.use(vuecs, ...)`, optionally with reactive sources, and every component picks it up.

## Why a second system?

The theme system handles CSS classes. But things like the `useSubmitButton()` composable's "Create" / "Update" labels (`submitButton` defaults), `<VCFormSelect>`'s placeholder option text, and `<VCListItem>`'s `textPropName` aren't classes — they're plain values. Putting them through the theme resolver would conflate two different concerns. So they get their own manager with the same shape.

## Resolution layers

For each resolved key, three layers in priority order:

```text
1. Instance prop (non-undefined)            ← highest priority
2. Global defaults (from app.use() config)  ← may be MaybeRef (ref / computed)
3. Hardcoded fallback (passed to composable) ← lowest priority
```

## Important contract

Two rules govern what shows up on `defaults.value`:

1. **The hardcoded object drives the shape.** The composable iterates `Object.keys(hardcoded)`. If you set a global default for a key not listed in hardcoded, it's silently dropped. If you add a new configurable key, list it in hardcoded too.
2. **Only `undefined` triggers fallthrough.** `null` on the instance prop wins over both global and hardcoded. This lets consumers deliberately "unset" — but means `null` cannot be used to toggle a boolean off (pass `false` instead).

## Setup API

```ts
import vuecs from '@vuecs/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

app.use(vuecs, {
    themes: [tailwindTheme()],
    defaults: {
        submitButton: {
            createText: computed(() => t('actions.create')),
            updateText: computed(() => t('actions.update')),
        },
        listNoMore: {
            content: computed(() => t('list.noMore')),
        },
        formSelect: {
            optionDefaultValue: computed(() => t('forms.selectPlaceholder')),
        },
    },
});
```

`computed` values unwrap transparently — when the locale changes, the resolved value updates and dependent components re-render.

## Consumer side

```vue
<script setup lang="ts">
import { VCButton } from '@vuecs/button';
import { useSubmitButton } from '@vuecs/form-controls';

// `submit` is a reactive bind-object — label / icon / color swap with `isEditing`,
// resolved through the `submitButton` defaults registered above.
const submit = useSubmitButton({ isEditing: () => false });
</script>

<template>
    <VCButton v-bind="submit" />
</template>
```

## Composite components — important

When a composite component (e.g. `VCList`) forwards behavioral props to a child component whose prop is resolved via `useComponentDefaults`, the composite's own Vue `prop.default` must be `undefined`. Otherwise, the composite always wins layer 1 on the child and shadows the child's global defaults entirely.

See `VCList.noMoreContent` and `VCList.itemTextPropName` (both `default: undefined`) for the canonical pattern.

## Migrated components

| Component | Configurable keys |
|-----------|-------------------|
| `useSubmitButton()` (`submitButton`) | `createText`, `updateText`, `createIcon`, `updateIcon`, `createColor`, `updateColor` |
| `VCFormSelect` | `optionDefault`, `optionDefaultId`, `optionDefaultValue` |
| `VCFormGroup` | `validation` |
| `VCFormInputCheckbox` | `labelContent` |
| `VCListItem` | `textPropName` |
| `VCListNoMore` | `content` |

Each component's Vue `prop.default` is `undefined`; the effective default lives in the `behavioralDefaults` constant inside the component.

## Type-safe keys

The augmentable `ComponentDefaults` interface registers each component's keys:

```ts
declare module '@vuecs/core' {
    interface ComponentDefaults {
        submitButton?: ComponentDefaultValues<{
            createText: string;
            updateText: string;
            createIcon: string;
            updateIcon: string;
        }>;
    }
}
```

`ComponentDefaultValues<T>` wraps each field as `MaybeRef<T[K] | undefined>` so reactive and plain values are both accepted.

## Resolver API

- **`DefaultsManager`** — holds the `Partial<ComponentDefaults>` map in a `shallowRef`; `setDefaults()` for runtime updates.
- **`installDefaultsManager(app, options)`** — Vue plugin; called from `@vuecs/core`'s top-level `install()` and from each component package.
- **`useComponentDefaults(name, props, hardcoded)`** — composable; returns `ComputedRef<T>` that recomputes on prop or manager state change.

## See also

- [Theme System](/guide/theme-system) — the parallel system for class strings
- [Installation](/getting-started/installation) — where to wire `defaults` into `app.use()`
