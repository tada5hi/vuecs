# @vuecs/forms

[![npm version](https://badge.fury.io/js/@vuecs%2Fforms.svg)](https://badge.fury.io/js/@vuecs%2Fforms)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Form input components for Vue 3 on top of [Reka UI](https://reka-ui.com) primitives: a complete set of accessible inputs with `v-model` contract, validation hooks, and a shared `FormOption` shape across the pickers.

Full documentation:

- [FormInput](https://vuecs.dev/components/form-input)
- [FormNumber](https://vuecs.dev/components/form-number)
- [FormPin](https://vuecs.dev/components/form-pin)
- [FormTextarea](https://vuecs.dev/components/form-textarea)
- [FormCheckbox + CheckboxGroup](https://vuecs.dev/components/form-checkbox)
- [FormSwitch](https://vuecs.dev/components/form-switch)
- [FormRadio + RadioGroup](https://vuecs.dev/components/form-radio)
- [FormSelect](https://vuecs.dev/components/form-select)
- [FormSelectSearch](https://vuecs.dev/components/form-select-search)
- [FormSlider](https://vuecs.dev/components/form-slider) — single value or range, same component
- [FormTags](https://vuecs.dev/components/form-tags)
- [FormGroup + ValidationGroup](https://vuecs.dev/components/form-group)
- [Button + `useSubmitButton()`](https://vuecs.dev/components/button) — the previous `VCFormSubmit` is now `VCButton` driven by an experimental composable

```bash
npm install @vuecs/forms
```

## 3.0 — major rename + Reka migration

`@vuecs/form-controls` (≤2.x) was renamed to **`@vuecs/forms`** in 3.0. Highlights:

- **Renamed** — update imports: `import { ... } from '@vuecs/forms'`. The old `@vuecs/form-controls` package is removed; no shim. Migrate in one pass.
- **`VCFormInputCheckbox` was split** into three Reka-backed components: `<VCFormCheckbox>` (single, supports `boolean | 'indeterminate'`), `<VCFormCheckboxGroup>` (array v-model with roving focus), `<VCFormSwitch>` (Reka `Switch` primitive — distinct ARIA semantics).
- **`VCFormRangeMultiSlider` was replaced** by `<VCFormSlider>` (Reka `Slider` primitive). One component handles both single (scalar `v-model`) and range (`number[]` `v-model`) modes; thumb count derives from the array shape.
- **Option shape redesign** — `FormSelectOption` (`{ id, value }` — value-was-the-label, inverted) replaced with `FormOption<T>` (`{ value, label, disabled?, description?, icon?, meta? }`) + `FormOptionGroup<T>` for `<optgroup>`. Single `placeholder` prop replaces the `optionDefault` / `optionDefaultId` / `optionDefaultValue` triplet.
- **New components on Reka primitives** — `<VCFormRadio>` + `<VCFormRadioGroup>`, `<VCFormPin>` (PIN/OTP), `<VCFormNumber>` (typed number input with steppers), `<VCFormTags>` (multi-value chip input).
- **`vue-tsc --emitDeclarationOnly`** runs without `|| true` masking — types are validated.

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
