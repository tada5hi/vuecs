# FormSubmit

Submit button with create/update modes — text resolves through the [Behavioral Defaults](/guide/behavioral-defaults) system, so the button label is i18n-friendly without per-instance overrides. The `isEditing` prop swaps the rendered text and theme classes (separate `createButton` vs `updateButton` slot in the theme).

```bash
npm install @vuecs/form-controls
```

## Basic usage

<Demo name="form-submit">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormSubmit } from '@vuecs/form-controls';
</script>

<template>
    <!-- Create mode (theme renders the createButton slot — green by default in theme-tailwind) -->
    <VCFormSubmit :invalid="false" />

    <!-- Update mode (renders the updateButton slot — blue by default) -->
    <VCFormSubmit :invalid="false" :is-editing="true" />

    <!-- Override the button text per-instance -->
    <VCFormSubmit :invalid="false" create-text="Save" />

    <!-- Busy state — disabled + structural pulse + cursor: wait -->
    <VCFormSubmit :invalid="false" :busy="true" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/*
 * Required for the busy-state animation (vc-form-submit--busy).
 * Without this import the busy button still disables but doesn't
 * pulse / show the wait cursor.
 */
@import "@vuecs/form-controls";

/* Optional: enables Font Awesome icons in the create/update icon slots. */
/* @import "@fortawesome/fontawesome-free/css/all.css"; */

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Behavioral defaults

| Key | Default | Description |
|-----|---------|-------------|
| `type` | `'button'` | HTML tag rendered for the root (e.g. `'button'`, `'a'`) |
| `icon` | `true` | Render an icon node — only emits an `<i>` when the theme also defines a non-empty `createIcon`/`updateIcon` class |
| `createText` | `'Create'` | Text rendered when `isEditing` is false |
| `updateText` | `'Update'` | Text rendered when `isEditing` is true |

Set globally for i18n:

```ts
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

app.use(vuecs, {
    defaults: {
        formSubmit: {
            createText: computed(() => t('actions.create')),
            updateText: computed(() => t('actions.update')),
        },
    },
});
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Two-way bound; component sets to `true` while a `submit` promise is in-flight, then back to `false` |
| `isEditing` | `boolean` | `false` | Render `updateText` and the `updateButton` theme slot instead of `createText` / `createButton` |
| `busy` | `boolean` | `false` | Disable + show busy state (`vc-form-submit--busy` structural class — wait cursor + opacity pulse) |
| `invalid` | `boolean` | `true` | Disables the button. Defaults to `true` so the form must explicitly mark itself valid before allowing submit |
| `submit` | `() => Promise<any> \| any` | — | Optional submit handler. If it returns a promise, `modelValue` flips to `true` for the duration |
| `createText` | `string` | (defaults system) | Override the create-mode label per instance |
| `updateText` | `string` | (defaults system) | Override the update-mode label per instance |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | v-model — flips `true` while a submit promise is pending |

## Notes

- Setting `type="a"` renders the submit as `<a>`. The structural busy class still applies, but the native `disabled` attribute is a no-op on anchors — guard navigation via your own click handler if you mount the submit as a link.
