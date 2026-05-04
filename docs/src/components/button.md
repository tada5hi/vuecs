# Button

General-purpose button with semantic `color`, `variant`, and `size` variants. The two themes that ship visual class mappings (`@vuecs/theme-tailwind`, `@vuecs/theme-bootstrap`) provide the full color × variant × size matrix; consumers switch looks by changing variant values, not by re-styling per instance.

```bash
# `@vuecs/forms` is only needed for the `useSubmitButton()` helper shown
# below; the button itself ships standalone in `@vuecs/button`.
npm install @vuecs/button @vuecs/forms
```

## Basic usage

<Playground name="button">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCButton } from '@vuecs/button';
import { useSubmitButton } from '@vuecs/forms';
import { ref } from 'vue';

const isEditing = ref(false);
const submit = useSubmitButton({ isEditing: () => isEditing.value });
</script>

<template>
    <!-- Color axis (solid is the default variant). -->
    <VCButton color="primary" label="Primary" />
    <VCButton color="success" label="Success" />
    <VCButton color="warning" label="Warning" />
    <VCButton color="error" label="Danger" />
    <VCButton color="neutral" label="Neutral" />

    <!-- Variant axis (primary is the default color). -->
    <VCButton variant="solid" label="Solid" />
    <VCButton variant="soft" label="Soft" />
    <VCButton variant="outline" label="Outline" />
    <VCButton variant="ghost" label="Ghost" />
    <VCButton variant="link" label="Link" />

    <!-- Size + state axes. `loading` shows the structural busy state
         (cursor: wait + opacity pulse); `disabled` is the inert sibling. -->
    <VCButton size="sm" label="Small" />
    <VCButton size="md" label="Medium" />
    <VCButton size="lg" label="Large" />
    <VCButton :loading="true" label="Loading…" />
    <VCButton :disabled="true" label="Disabled" />

    <!-- useSubmitButton() returns a reactive bind-object — label / icon /
         color swap when `isEditing` flips. The DefaultsManager hook in a
         real bind site. -->
    <button @click="isEditing = !isEditing">
        Toggle isEditing ({{ isEditing ? 'on' : 'off' }})
    </button>
    <VCButton v-bind="submit" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/*
 * Required for the busy-state animation (vc-button--busy).
 * Without this import the busy button still disables but doesn't
 * pulse / show the wait cursor.
 */
@import "@vuecs/button";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'primary' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | (theme default) | Semantic color — themes map it onto their palette. Tailwind theme defaults to `primary`. |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'` | (theme default) | Visual treatment. Tailwind theme defaults to `solid`. |
| `size` | `'sm' \| 'md' \| 'lg'` | (theme default) | Padding / font-size. Tailwind theme defaults to `md`. |
| `type` | `string` | `'button'` | Forwarded as the native `type` attribute when `tag` is `'button'` (use `'submit'` inside `<form>`). |
| `tag` | `string` | `'button'` | Override the rendered tag — pass `'a'` to render as a link (the component sets `aria-disabled` instead of the no-op `disabled` attribute on non-button tags). |
| `label` | `string` | — | Inline text. Equivalent to passing the same string as the default slot. |
| `iconLeft` | `string` | — | Iconify name for a leading icon (e.g. `'lucide:plus'`), resolved through `<VCIcon>`. Skipped when empty / undefined. |
| `iconRight` | `string` | — | Iconify name for a trailing icon. Same skip behavior as `iconLeft`. |
| `loading` | `boolean` | `false` | Disables the button and applies `vc-button--busy` (wait cursor + opacity pulse). Also resolves as the `loading` themeVariant. |
| `disabled` | `boolean` | `false` | Disables without the busy state. |
| `themeClass` | `Partial<ButtonThemeClasses>` | — | Per-instance slot class overrides — see [Theme System](/guide/theme-system). |
| `themeVariant` | `Record<string, string \| boolean>` | — | Lower-priority variant overrides; merged with the convenience props above. |

## Slots

| Slot | Slot props | Description |
|------|------------|-------------|
| `default` | `{ loading, disabled }` | Button content. Takes precedence over the `label` prop. |
| `leading` | `{ loading, disabled }` | Custom leading content (replaces the `iconLeft` `<VCIcon>`). |
| `trailing` | `{ loading, disabled }` | Custom trailing content (replaces the `iconRight` `<VCIcon>`). |

## Submit-button helper

For the create / update / save form-submit pattern previously baked into `VCFormSubmit`, `@vuecs/forms` ships an experimental `useSubmitButton()` composable. It returns a reactive bind-object that swaps `label` / `iconLeft` / `color` based on `isEditing`, with all four customization knobs resolved through the [Behavioral Defaults](/guide/behavioral-defaults) system.

```vue
<script setup lang="ts">
import { VCButton } from '@vuecs/button';
import { useSubmitButton } from '@vuecs/forms';
import { ref } from 'vue';

const isEditing = ref(false);
const loading = ref(false);

const submit = useSubmitButton({
    isEditing: () => isEditing.value,
    loading: () => loading.value,
});
</script>

<template>
    <VCButton v-bind="submit" />
</template>
```

The composable reads from `defaults.submitButton` (DefaultsManager). Wire i18n labels and color choices once at `app.use()` time:

```ts
app.use(vuecs, {
    defaults: {
        submitButton: {
            createText: computed(() => t('actions.create')),
            updateText: computed(() => t('actions.update')),
            createIcon: 'lucide:plus',
            updateIcon: 'lucide:save',
            createColor: 'success',
            updateColor: 'primary',
        },
    },
});
```

::: warning Experimental
The composable's option names, return shape, and defaults key may change in a future minor release. Pin a version if you depend on the exact API.
:::

## Notes

- Setting `tag="a"` renders the button as `<a>`. The structural busy class still applies, but the native `disabled` attribute is a no-op on anchors — guard navigation via your own click handler if you mount the button as a link.
- The `loading` prop is also passed as a `themeVariant` (`loading: true`), so themes can target the busy state via a variant if they want a custom look beyond the structural pulse.
- Themes ship the full color × variant matrix (six colors × five variants). Override individual cells via `app.use(vuecs, { overrides: { elements: { button: { compoundVariants: [...] } } } })` if you need a different shade.
- The `loading` state replaces the leading icon with a spinner and lifts opacity above the framework-disabled value so loading reads distinctly from disabled (the busy class otherwise inherits the framework's `disabled:opacity-*` and the two states would render identically).
