# Validation feedback

`<VCFormGroup>` accepts a `:validation` bundle — a single prop carrying both severity and translated messages for the wrapped field. This is the documented integration point for validation libraries that produce per-field feedback (canonically: [`@ilingo/validup-vue`](https://www.npmjs.com/package/@ilingo/validup-vue)).

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { useValidup } from '@validup/vue';
import { useFieldValidation } from '@ilingo/validup-vue';
import { signInContainer } from './validators';

const state = reactive({ email: '', password: '' });
const $v = useValidup(signInContainer, state);
</script>

<template>
  <VCFormGroup :validation="useFieldValidation($v.fields.email)">
    <VCFormInput v-model="$v.fields.email.$model" type="email" />
  </VCFormGroup>
</template>
```

One `v-bind`, three packages, no shape coupling. See [plan 036](https://github.com/tada5hi/vuecs/blob/master/.agents/plans/036-validation-feedback-bridge.md) for the full architecture.

## The `FieldValidation` shape

`@vuecs/forms` exports a `FieldValidation` type — the structural contract a `:validation` consumer must produce:

```ts
type FieldValidation = {
    severity?: 'error' | 'warning' | 'success';
    messages: { key: string; value: string }[];
};
```

Vuecs declares this type **independently** of any validation library — `@ilingo/validup-vue`'s `FieldValidation` is structurally identical, so binding works without either package importing the other. Drop-in for any future validation bridge (Yup, Zod, custom) that ships a matching shape.

## Class application

| `severity` | Root class applied |
|---|---|
| `'error'` | `validationError` (theme slot) |
| `'warning'` | `validationWarning` (theme slot) |
| `'success'` | — (no `validationSuccess` slot today; reserved for forward-compat) |
| `undefined` | — |

The class is **only** applied when `messages` is non-empty. A bundle with severity `'success'` and empty messages renders nothing — the section stays clean for pristine fields.

## Precedence over the legacy props

`<VCFormGroup>` historically accepted `:validation-severity` + `:validation-messages` as two separate props. Both still work, with `@deprecated` JSDoc pointing at `:validation`:

```vue
<!-- New (recommended) -->
<VCFormGroup :validation="useFieldValidation($v.fields.email)">…</VCFormGroup>

<!-- Legacy (still supported) -->
<VCFormGroup
  :validation-severity="severity"
  :validation-messages="messages"
>…</VCFormGroup>
```

Resolution: when `:validation` is set (non-null), it wins. Pass `:validation="null"` (or omit the prop) to fall through to the legacy props — useful when the parent toggles between bundle-driven and manually-constructed feedback.

## When the section renders

Content-driven, no visibility prop. The `<VCValidationGroup>` section renders iff **any** of:

- `:validation` is non-null and its `messages` array is non-empty.
- `:validation-messages` (legacy) is non-empty.
- A `#validationGroup` or `#validationItem` slot is provided — slots may render content from sources other than `messages` (e.g. always-visible status indicators), so their presence alone is enough.

A pristine field (`:validation="{ severity: undefined, messages: [] }"`) renders nothing. The previous `:validation` boolean visibility toggle was removed in 5.0 — visibility now follows what's actually being displayed.

## `'success'` severity — current state

`FieldValidation.severity` accepts `'success'` for forward-compat with bridges that surface a "passed" state. There's no `validationSuccess` theme slot yet — the class application is a no-op, but the section still renders if `messages` is non-empty (useful for "this email looks valid; we'll send confirmation" affirmative messages).

If you want a success class on the root, theme it via `themeClass`:

```vue
<VCFormGroup
  :validation="feedback"
  :theme-class="{ root: feedback.severity === 'success' ? 'has-success' : '' }"
>…</VCFormGroup>
```

A dedicated `validationSuccess` slot may ship later if demand materializes.

## Severity types

Vuecs's `ValidationSeverity` enum stays `'error' | 'warning'` for the legacy `:validation-severity` prop. The `FieldValidation` shape's wider union (`'error' | 'warning' | 'success'`) is the bridge-facing type; the two coexist intentionally — the enum is the vuecs-native vocabulary, the bundle accepts whatever a validation library naturally produces.
