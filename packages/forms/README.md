# @vuecs/forms

[![npm version](https://img.shields.io/npm/v/@vuecs/forms)](https://www.npmjs.com/package/@vuecs/forms)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The complete form-input family of [vuecs](https://github.com/tada5hi/vuecs)** — accessible inputs on [Reka UI](https://reka-ui.com) primitives with a clean `v-model` contract, validation feedback, and a shared `FormOption` shape across every picker.

## ✨ What's inside

- ⌨️ **Text & numbers** — `<VCFormInput>`, `<VCFormTextarea>`, `<VCFormNumber>` (typed, with steppers), `<VCFormPin>` (PIN/OTP).
- ✅ **Toggles** — `<VCFormCheckbox>` (incl. `indeterminate`), `<VCFormCheckboxGroup>`, `<VCFormSwitch>`, `<VCFormRadio>` / `<VCFormRadioGroup>`.
- 📋 **Pickers** — `<VCFormSelect>`, `<VCFormSelectSearch>`, `<VCFormTags>`, all driven by the same `FormOption<T>` shape (`{ value, label, disabled?, icon?, … }`) + `FormOptionGroup<T>`.
- 🎚️ **`<VCFormSlider>`** — single value or range from one component; thumb count derives from the `v-model` shape.
- 🧪 **Validation feedback** — wrap any input in `<VCFormGroup>`: it renders label + messages and folds an `error` / `warning` severity onto the input's theme variant automatically, with zero per-input wiring.
- 🌐 **i18n-ready defaults** — placeholders, labels, and validation copy resolve through `@vuecs/core`'s behavioral-defaults pipeline (reactive `MaybeRef` values welcome).
- 🚀 **`useSubmitButton()`** *(experimental)* — a reactive bind-object for create/update submit buttons on `@vuecs/button`.

## 📦 Installation

```bash
npm install @vuecs/forms
```

## ⚡ Usage

```vue
<VCFormGroup label-content="Email" :validation-messages="errors.email">
    <VCFormInput v-model="form.email" type="email" />
</VCFormGroup>

<VCFormSelect
    v-model="form.role"
    :options="[
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' },
    ]"
    placeholder="-- Select a role --"
/>

<VCFormSlider v-model="priceRange" :min="0" :max="500" />  <!-- range: v-model is number[] -->
```

## 📚 Documentation

One page per component on **[vuecs.dev](https://vuecs.dev/components/)**:

[Input](https://vuecs.dev/components/form-input) · [Textarea](https://vuecs.dev/components/form-textarea) · [Number](https://vuecs.dev/components/form-number) · [Pin](https://vuecs.dev/components/form-pin) · [Checkbox](https://vuecs.dev/components/form-checkbox) · [Switch](https://vuecs.dev/components/form-switch) · [Radio](https://vuecs.dev/components/form-radio) · [Select](https://vuecs.dev/components/form-select) · [SelectSearch](https://vuecs.dev/components/form-select-search) · [Slider](https://vuecs.dev/components/form-slider) · [Tags](https://vuecs.dev/components/form-tags)

Guide: [Validation feedback](https://vuecs.dev/guide/validation-feedback)

## 🔄 Migrating from `@vuecs/form-controls` (≤2.x)

`@vuecs/form-controls` was renamed to **`@vuecs/forms`** in 3.0 — a clean break, no shim:

- `VCFormInputCheckbox` split into `<VCFormCheckbox>` / `<VCFormCheckboxGroup>` / `<VCFormSwitch>` (distinct ARIA semantics).
- `VCFormRangeMultiSlider` replaced by `<VCFormSlider>` (one component, single + range).
- `FormSelectOption` (`{ id, value }`) replaced by `FormOption<T>` (`{ value, label, … }`); the `optionDefault*` triplet collapsed into one `placeholder` prop.
- New Reka-backed components: Radio, Pin, Number, Tags.
- `VCFormSubmit` decomposed into `<VCButton>` + `useSubmitButton()`.

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
