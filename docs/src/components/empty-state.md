# EmptyState

Placeholder block for a collection with no records yet, or a search / filter that matched nothing. Renders an optional icon, a title, a description and one action inside a dashed-border, centered card. Presentational: it emits `action` and the parent decides what that means — open a create dialog, reset the filters, navigate.

```bash
npm install @vuecs/elements
```

<Playground name="empty-state" component="VCEmptyState">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCEmptyState } from '@vuecs/elements';
</script>

<template>
    <VCEmptyState
        title="No users yet"
        description="Users you create will show up here."
        action-label="Create user"
        @action="openCreateDialog"
    />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/elements";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## Variants

| `variant` | Meaning | Default copy |
|---|---|---|
| `empty` (default) | The collection has no records yet | none — pass `title` / `description` / `actionLabel` |
| `noResults` | A search or filter matched nothing | title `No results`, description `Try adjusting your search or filters.`, action `Reset` |

Explicit props always win over the default copy — so pass `undefined` for the props you want the `noResults` defaults to fill. The same component covers both states of a collection page:

```vue
<VCEmptyState
    :variant="filtered ? 'noResults' : 'empty'"
    :title="filtered ? undefined : 'No users yet'"
    :action-label="filtered ? undefined : 'Create user'"
    @action="filtered ? resetFilters() : openCreateDialog()"
/>
```

`variant` is also passed to the theme as a variant axis, so a theme can style the two states differently. The shipped themes use a primary action for `empty` and a quieter outline / light action for `noResults`.

## Translating the default copy

The `noResults` strings are [behavioral defaults](/guide/behavioral-defaults) under the `emptyState` key — set them globally, statically or as refs that follow the active locale:

```ts
app.use(vuecs, {
    defaults: {
        emptyState: {
            noResultsTitle: 'Keine Ergebnisse',
            noResultsDescription: 'Passe die Suche oder die Filter an.',
            noResultsActionLabel: 'Zurücksetzen',
        },
    },
});
```

## Action

The built-in action is a `<button type="button">` that emits `action`. It renders only when `actionLabel` is set (or `variant="noResults"` supplies one). To render something else — a router link, a dropdown — use the `#action` slot. It receives the theme class and an `action` callback that emits the event:

```vue
<VCEmptyState title="No projects" @action="track('empty-cta')">
    <template #action="{ class: actionClass, action }">
        <RouterLink :class="actionClass" to="/projects/new" @click="action">
            Start a project
        </RouterLink>
    </template>
</VCEmptyState>
```

## Icon

`icon` takes an Iconify name (e.g. `lucide:inbox`) and renders through `<VCIcon>` when [`@vuecs/icon`](/components/icon) is installed; otherwise it is skipped. The rendered icon is `aria-hidden`. The `#icon` slot replaces it with arbitrary content.

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Heading text. `noResults` falls back to `noResultsTitle`. |
| `description` | `string` | — | Body text. Replaced by the default slot. `noResults` falls back to `noResultsDescription`. |
| `actionLabel` | `string` | — | Label of the built-in action button. `noResults` falls back to `noResultsActionLabel`. |
| `variant` | `'empty' \| 'noResults'` | `'empty'` | Which state is shown; also a theme variant. |
| `icon` | `string` | — | Iconify name for the leading icon. |
| `as` | `string \| Component` | `'div'` | Root element. |
| `themeClass` | `Partial<EmptyStateThemeClasses>` | — | Per-instance class overrides. |
| `themeVariant` | `VariantValues` | — | Per-instance variant values. |

### Events

| Event | Payload | Description |
|---|---|---|
| `action` | — | The built-in button was clicked, or the `#action` slot called `action()`. |

### Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Replaces the description. |
| `icon` | `{ class }` | Replaces the `icon` prop. |
| `title` | — | Replaces the `title` prop. |
| `action` | `{ class, action }` | Replaces the built-in button. Call `action()` to emit the `action` event. |

### Theme keys

`emptyState` — `root`, `icon`, `title`, `description`, `action`. Variant axis: `variant` (`empty` / `noResults`).

### Behavioral defaults

`emptyState` — `noResultsTitle`, `noResultsDescription`, `noResultsActionLabel`.

The element has no live-region `role` — it is static content. If it replaces results in response to typing, announce the change with your own live region.
