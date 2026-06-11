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

## Severity flows down to the child input

`<VCFormGroup>` provides its resolved severity through a Vue context (`provideFormGroupContext`) and every form-input component in `@vuecs/forms` (`VCFormInput`, `VCFormTextarea`, `VCFormSelect`, `VCFormSelectSearch`, `VCFormNumber`, `VCFormTags`, `VCFormCheckbox`, `VCFormSwitch`, `VCFormRadio`, `VCFormPin`, `VCFormSlider`, plus the matching `*Group`s) reads it and folds it into its own `themeVariant.severity`.

What that means in practice: if your theme declares a `severity` variant on a form-input element, just wrapping the input in `<VCFormGroup :validation>` is enough to repaint the input's border / focus ring to match the validation state. **No per-input wiring required.**

```vue
<VCFormGroup :validation="useFieldValidation($v.fields.email)">
  <VCFormInput v-model="$v.fields.email.$model" />
</VCFormGroup>
```

When the field becomes `error`, the input picks up the theme's `formInput.variants.severity.error` classes (e.g. red border + red focus ring in `theme-tailwind`). When it becomes `warning`, the `warning` cell. When pristine (`severity: undefined`), no override — the input renders with its default border.

### All shipping themes declare it

| Theme | `error` chrome | `warning` chrome | Notes |
|---|---|---|---|
| `theme-tailwind` | `border-error-500 focus:border-error-500 focus:ring-error-500` | `border-warning-500` + matching focus ring | Border + focus ring only; input background stays neutral |
| `theme-bootstrap` | `.is-invalid` | `.is-invalid` (same — Bootstrap 5 ships no soft-severity form-control utility, so `error` and `warning` collapse) | Override `formInput.variants.severity.warning` to a custom amber class if you need a real distinction |
| `theme-bulma` | `.is-danger` | `.is-warning` | Bulma's input states tint **background + border + focus shadow** — more saturated than the Tailwind look. The HSL-channel mechanism means there's no pure-border-only variant |

The validation **message text** below the input picks up the matching colour too. `<VCValidationGroup>` folds the `:severity` prop into `themeVariant.severity` so each rendered message gets the right `text-*-600` class per state. Without this layered severity, warning messages used to inherit `text-error-600` from `validationGroup.item`'s base — looking red even though the input border went amber.

### Severity covers more than just "validation failed"

Severity flows from your validation source's notion of state, which typically includes more than just pass/fail. Using [`@validup/vue`](https://www.npmjs.com/package/@validup/vue)'s `getSeverity()` as a reference (see the [validup-vue source](https://github.com/tada5hi/validup/blob/master/packages/vue/src/helpers/severity.ts)):

| State | Severity | What the input looks like |
|---|---|---|
| Field is pristine + valid | `undefined` | Default border |
| Validators are currently running (`$pending`) | `'warning'` | Amber border, message may be empty |
| Pristine but the schema requires a value (pre-touch hint) | `'warning'` | Amber border, no message text yet |
| Touched + invalid (required mount failed) | `'error'` | Red border + red message |
| Touched + invalid (only optional mounts failed) | `'warning'` | Amber border + amber message |
| Touched + valid (passed) | `'success'` | Default border today (no theme class) — forward-compat for themes that add a green-border variant |

The pending-state and pre-touch-hint cases mean the input border may colour before any message text appears. That's intentional — the border alone is the "something is up with this field" affordance.

### `success` severity (forward-compat)

Today none of the three shipping themes declare a `severity.success` variant — `validation.severity === 'success'` propagates through the context but produces no class change on the input (same end result as `undefined`). The wiring is in place though: any consumer theme that adds a `severity.success` entry on `formInput` (etc.) will automatically light up green borders on passed fields. The validation-message `validationSuccess` slot is on the same forward-compat track.

### Per-instance override

If a specific input shouldn't follow its parent FormGroup's severity, pass `themeVariant.severity` explicitly — per-instance wins. Setting it to `undefined` is the "force pristine" escape hatch:

```vue
<VCFormGroup :validation="parentBundle">
  <!-- Inherits parent severity -->
  <VCFormInput v-model="state.email" />
  <!-- Explicit override; ignores the FormGroup context -->
  <VCFormInput v-model="state.note" :theme-variant="{ severity: undefined }" />
</VCFormGroup>
```

### Nested FormGroups

Stacking `<VCFormGroup>`s (unusual but supported) — the **inner** group's severity wins for its children, because Vue's `provide` shadows the outer key. So a `<VCFormGroup :validation="warningBundle">` inside a `<VCFormGroup :validation="errorBundle">` paints its child input amber, not red.

### Outside a FormGroup

Form inputs mounted standalone (no surrounding `<VCFormGroup>`) render with their default border. The context is optional — the helper short-circuits when no parent context exists.

### Toggle controls have no severity variants today

`VCFormCheckbox`, `VCFormCheckboxGroup`, `VCFormSwitch`, `VCFormRadio`, `VCFormRadioGroup`, `VCFormPin`, and `VCFormSlider` consume the FormGroup context (forward-compat) but no shipping theme declares `severity` variants on them — toggles are usually too small for a meaningful border ring, and the FormGroup's message text below the control covers the UX. Themes that want amber/red toggle outlines can add their own `severity` variant entries; the wiring is already in place.

### Public API

The plumbing is exported for downstream component libraries that want to build their own form-input variants on the same context:

```ts
import {
    provideFormGroupContext,
    useFormGroupContext,
    useFormInputThemeProps,
} from '@vuecs/forms';
```

`useFormInputThemeProps(props)` is the helper every shipped input uses — pass it as the second arg to `useComponentTheme()` and your input picks up the inherited severity automatically.

## See also

- [Variants](/guide/variants) — `severity` is a regular variant axis on the form-input theme elements
- [`<VCFormInput>`](/components/form-input) — the canonical severity-aware input
- [Theme System](/guide/theme-system) — overriding the `validationError` / `validationWarning` slot classes
