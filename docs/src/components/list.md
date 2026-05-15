# List

Compound list components for Vue 3. Five parts compose a list:
`VCList` (state owner + selection coordinator), `VCListBody` (`<ul>`),
`VCListItem` (`<li>`), `VCListEmpty`, `VCListLoading`. Theme classes
flow through slot props — consumers render their own `<header>` /
`<footer>` / `<span>` markup with the resolved class strings.

Plus a `defineList()` composable that holds state + mutators, a
`useList()` injector for shared-state access from child components, and
a `useListItem()` injector for row-content children.

```bash
npm install @vuecs/list
```

::: warning Successor to `@vuecs/list-controls`
This package is the successor to `@vuecs/list-controls@2.x`. The
compound rewrite is a clean break — see
[Migration from `@vuecs/list-controls`](#migration-from-vuecs-list-controls)
at the bottom of this page.
:::

## Basic usage

<Playground name="list">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCList,
    VCListBody,
    VCListEmpty,
    VCListItem,
    VCListLoading,
} from '@vuecs/list';
import { ref } from 'vue';

type Fruit = { id: number; name: string; stock: number };

const data = ref<Fruit[]>([
    { id: 1, name: 'Apples', stock: 12 },
    { id: 2, name: 'Oranges', stock: 5 },
    { id: 3, name: 'Pears', stock: 8 },
]);

const selected = ref<Array<string | number>>([]);

function remove(id: number): void {
    data.value = data.value.filter((row) => row.id !== id);
    selected.value = selected.value.filter((k) => k !== id);
}
</script>

<template>
    <VCList
        v-model:selection="selected"
        :data="data"
        selection-mode="multi"
    >
        <template #default="{ classes }">
            <header :class="classes.header">
                <strong>Fruit basket</strong>
            </header>

            <VCListBody>
                <template #item="{ data: item }">
                    <VCListItem :data="item" :selectable="true">
                        <template #default="{ classes: itemClasses }">
                            <span :class="itemClasses.text">
                                {{ item.name }}
                                <small>{{ item.stock }} in stock</small>
                            </span>
                            <span :class="itemClasses.actions">
                                <button type="button" @click="remove(item.id)">
                                    Remove
                                </button>
                            </span>
                        </template>
                    </VCListItem>
                </template>
            </VCListBody>

            <VCListEmpty>Nothing left — add some fruit.</VCListEmpty>
            <VCListLoading>Loading…</VCListLoading>

            <footer :class="classes.footer">
                {{ data.length }} item{{ data.length === 1 ? '' : 's' }}
                <template v-if="selected.length">
                    · {{ selected.length }} selected
                </template>
            </footer>
        </template>
    </VCList>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## Anatomy

The five parts each own a slice of the list:

| Part | Element (default) | Role | Render condition |
|---|---|---|---|
| `<VCList>` | `<div>` | State + selection coordinator. Default slot exposes `{ classes }` for chrome markup. | Always |
| `<VCListBody>` | `<ul>` | Iterates `state.data` via the `#item` slot. Upgrades to `role="listbox"` when `selection-mode` is set. | `data.length > 0` (decoupled from `busy`) |
| `<VCListItem>` | `<li>` | Per-row container. Exposes `{ classes, isSelected, isFocused, isDisabled, isActive, isSelectable, toggle }` via its default slot. | Always (inside `<VCListBody>`) |
| `<VCListEmpty>` | `<div role="status">` | Empty-state placeholder. | `!busy && data.length === 0` |
| `<VCListLoading>` | `<div role="status" aria-live="polite">` | Loading placeholder. | `busy && data.length === 0` (or `busy` when `:overlay`) |

Header and footer chrome is **consumer markup** — there are no
`<VCListHeader>` / `<VCListFooter>` components. Read
`classes.header` / `classes.footer` off `<VCList>`'s default slot prop
and apply them to your own `<header>` / `<footer>` (or any element).

```vue
<VCList :data="users">
    <template #default="{ classes }">
        <header :class="classes.header">Users</header>
        <VCListBody>…</VCListBody>
        <footer :class="classes.footer">{{ users.length }} users</footer>
    </template>
</VCList>
```

The same applies inside `<VCListItem>` — the slot exposes per-row
`classes.text` / `classes.actions` for the row's content + action
clusters:

```vue
<VCListItem :data="item">
    <template #default="{ classes }">
        <span :class="classes.text">{{ item.name }}</span>
        <span :class="classes.actions">
            <button @click="edit(item)">Edit</button>
            <button @click="remove(item)">Delete</button>
        </span>
    </template>
</VCListItem>
```

## Selection

Set `selection-mode="single"` or `selection-mode="multi"` on
`<VCList>` to opt into selection. The list upgrades to ARIA
`role="listbox"` semantics, rows with `:selectable` participate, and
`v-model:selection` carries the bound keys.

```vue
<script setup lang="ts">
const selected = ref<Array<number>>([]);
</script>

<template>
    <VCList
        v-model:selection="selected"
        :data="users"
        selection-mode="multi"
    >
        <template #default>
            <VCListBody>
                <template #item="{ data }">
                    <VCListItem :data="data" :selectable="true">
                        {{ data.name }}
                    </VCListItem>
                </template>
            </VCListBody>
        </template>
    </VCList>
</template>
```

Activation:

- **Click anywhere on the row** toggles selection. Native interactive
  elements (`button`, `a[href]`, `input`, `select`, `textarea`,
  `[contenteditable]`, `[role="button|link|checkbox|switch"]`, plus
  anything tagged `[data-vc-noselect]`) auto-exclude — their clicks
  pass through unaffected.
- **Shift+click** selects a contiguous range from the last activated
  row (the range anchor).
- **Ctrl/Cmd+click** toggles a single row without affecting others.
- **Space / Enter** on a focused row activates selection.

Keys are derived via `defineList()`'s `itemKey` configuration
(`itemKey: 'id'` for an `id` field, or a function for custom logic).

::: warning Phase 1 keyboard nav
Arrow / Home / End navigation across selectable rows is not yet
wired — Click and Space/Enter activation work today. Full WAI-ARIA
listbox keyboard support is planned for a follow-up. Set
`selection-mode` to opt into the listbox semantics that are in place
(roles, `aria-selected`, roving `tabindex`).
:::

## Row state

`<VCListItem>` carries four row-state props:

| Prop | Default | Effect |
|---|---|---|
| `:selectable` | `false` | Row participates in selection (`role="option"`, click delegation, theme `selected` variant when active). |
| `:disabled` | `false` | Sets `aria-disabled="true"` + `data-disabled`. Disabled rows skip selection toggle and theme `disabled` variant activates. |
| `:active` | `false` | Sets `aria-current` (`'true'` when boolean, or the passed string like `'page'`) + `data-active`. Theme `active` variant activates. Independent of selection — purely visual / route-style highlight. |
| `:index` | `-1` | Position in the iteration order. Forwarded as a slot prop and used for roving-tabindex coordination. `<VCListBody>` supplies this automatically inside its `#item` slot. |

Each maps to a theme variant axis (`disabled.true`, `active.true`,
`selected.true`) which the bundled themes (tailwind / bootstrap /
bulma) all wire to a distinct visual treatment.

## Loading modes

`<VCListLoading>` has two render modes:

```vue
<!-- Default: shows only on first-load (busy ∧ data empty) -->
<VCListLoading>Loading…</VCListLoading>

<!-- Overlay: shows whenever busy. Pair with theme overlay positioning. -->
<VCListLoading :overlay="true">Refreshing…</VCListLoading>
```

`<VCListBody>` is **data-driven** — it renders the `<ul>` whenever
`data.length > 0`, regardless of `busy`. That decoupling lets you
compose three load-state patterns:

- **Default sibling** — Loading next to the body. Body hides when
  empty + busy (the default render condition); Loading fills the slot.
- **Inline footer** — keep `<VCListBody>` visible while loading; place
  a separate `<li>` (or pagination loader) inside the iteration.
- **Skeleton rows** — render placeholder `<li>`s alongside real rows
  when `busy` is true. The body's render condition (data-presence) is
  what makes this possible.

When `:overlay` is set, the loading variant in each theme uses
absolute positioning to float over the existing rows. `<VCList>`'s
root carries `relative` / `position-relative` / `is-relative` so the
overlay anchors to the list container.

## State container: `defineList()`

`<VCList>` constructs a minimal state container internally when you
pass `data` / `busy` / `total` / `meta`. For shared state across
views or extensible helpers, build your own and pass via `:state`:

```ts
import { defineList } from '@vuecs/list';

const users = ref<User[]>([]);

const list = defineList({
    data: users,                                  // ref / getter / plain
    setData: (next) => { users.value = next; },   // OPTIONAL — see below
    busy: loading,
    total,
    itemKey: 'id',                                // identity hint

    // Anything that's not first-class state goes in the typed `meta`
    // bag — pagination cursors, filter state, callbacks (`refresh`,
    // `load`), helper flags. Forwarded verbatim to `list.meta`.
    meta: {
        refresh: () => fetch('/users'),
        cursor,
    },
});

// list.data           — ComputedRef<T[]>
// list.busy           — ComputedRef<boolean>
// list.total          — ComputedRef<number>            (data.length fallback)
// list.meta           — Meta (verbatim; defaults to `{}`)
// list.isEmpty        — ComputedRef<boolean>           (!busy && total === 0)
// list.getItemKey(row) — resolve the row's identity key
// list.findIndex(item)
// list.applyCreate(arr, item) / applyUpdate / applyDelete  — pure helpers
// list.create(item) / update / delete                — bound mutators (when writer is derivable)
```

```vue
<VCList :state="list" v-model:selection="selected" selection-mode="multi">
    <template #default="{ classes }">
        <VCListBody>
            <template #item="{ data: row }">
                <VCListItem :data="row" :selectable="true">
                    {{ row.name }}
                </VCListItem>
            </template>
        </VCListBody>
    </template>
</VCList>
```

### Mutation: pure helpers vs. bound mutators

`defineList()` exposes `create` / `update` / `delete` mutators
whenever a writer can be derived from the input:

```ts
// data is a Ref → mutators wire automatically
const users = ref<User[]>([]);
const list = defineList({ data: users });
list.create(item);
list.update(item);
list.delete(item);

// data is a getter or plain array → pass setData to opt in
const list = defineList({
    data: () => store.users,
    setData: (next) => store.replaceUsers(next),
});
list.create(item);  // routes through the store
```

The pure `applyCreate` / `applyUpdate` / `applyDelete` helpers stay
exposed for full manual control:

```ts
const list = defineList({ data: users });
users.value = list.applyCreate(users.value, item);
```

Writer resolution order:

1. Explicit `setData` — wins unconditionally
2. `data` is a `Ref<T[]>` — auto-derived setter
3. Otherwise — no mutators; only the pure helpers

## Composables

### `useList<T>()`

Inside any descendant of `<VCList>`:

```ts
import { useList } from '@vuecs/list';

const { state, classes, selection } = useList<User>();

// state.data.value      — Ref<User[]>
// state.busy.value      — boolean
// classes.value         — resolved list-level theme classes
// selection.mode.value  — 'single' | 'multi' | undefined
// selection.isSelected(key)
// selection.toggle(key, opts?)
```

Throws if called outside a `<VCList>`.

### `useListItem<T>()`

Inside any descendant of `<VCListItem>` — useful in row-content child
SFCs that need per-row state without slot-prop drilling:

```ts
import { useListItem } from '@vuecs/list';

const {
    data, index, key, classes,
    isSelected, isFocused, isDisabled, isActive, isSelectable,
    toggle,
} = useListItem<User>();
```

All fields are `ComputedRef`s; `toggle` invokes the selection machine
for this row.

## Props

### `<VCList>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `ListState` | — | Pre-built state from `defineList()`. When set, the convenience props are ignored. |
| `data` | `T[]` | `[]` | Items (used when `state` is omitted). |
| `busy` | `boolean` | `false` | Loading flag (used when `state` is omitted). |
| `total` | `number` | `data.length` | Server-side total (used when `state` is omitted). |
| `meta` | `Record<string, unknown>` | — | Verbatim metadata bag (used when `state` is omitted; snapshot at setup). |
| `tag` | `string` | `'div'` | Outer container element. |
| `selectionMode` | `'single' \| 'multi' \| undefined` | `undefined` | Opt into listbox semantics + selection. |
| `selection` (v-model) | `SelectionKey[] \| SelectionKey \| null` | `null` | Selected keys; bound via `v-model:selection`. |
| `themeClass` | `ThemeClassesOverride<ListThemeClasses>` | — | Slot class overrides. |
| `themeVariant` | `VariantValues` | — | Variant overrides. |

### `<VCListBody>`

| Prop | Type | Default |
|------|------|---------|
| `tag` | `string` | `'ul'` |
| `asChild` | `boolean` | `false` |
| `themeClass` | `ThemeClassesOverride<ListBodyThemeClasses>` | — |
| `themeVariant` | `VariantValues` | — |

### `<VCListItem>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T` | — | The row record (forwarded as a slot prop + into the item-scope context). |
| `index` | `number` | `-1` | Position within iteration. Supplied automatically by `<VCListBody>`'s `#item` slot. |
| `selectable` | `boolean` | `false` | Row participates in selection. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `active` | `boolean \| 'page' \| 'step' \| 'location' \| 'date' \| 'time'` | `false` | Mark row as current (`aria-current`). |
| `tag` | `string` | `'li'` | Row element. |
| `asChild` | `boolean` | `false` | Clone the default slot's single vnode instead of emitting a wrapper. |
| `themeClass` | `ThemeClassesOverride<ListItemThemeClasses>` | — | |
| `themeVariant` | `VariantValues` | — | |

### `<VCListEmpty>`

| Prop | Type | Default |
|------|------|---------|
| `tag` | `string` | `'div'` |
| `asChild` | `boolean` | `false` |
| `themeClass` | `ThemeClassesOverride<ListEmptyThemeClasses>` | — |
| `themeVariant` | `VariantValues` | — |

### `<VCListLoading>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `string` | `'div'` | |
| `overlay` | `boolean` | `false` | Refresh-feedback mode — shows whenever `busy`, regardless of data presence. Theme overlay variant activates. |
| `asChild` | `boolean` | `false` | |
| `themeClass` | `ThemeClassesOverride<ListLoadingThemeClasses>` | — | |
| `themeVariant` | `VariantValues` | — | |

## Slots

| Component | Slot | Slot props |
|-----------|------|------------|
| `<VCList>` | `default` | `{ classes: ListThemeClasses }` |
| `<VCListBody>` | `item` | `{ data, index }` — fires once per row |
| `<VCListBody>` | `default` | `{ data: unknown[] }` — escape hatch (virtual scrolling, ad-hoc layouts); bypasses iteration |
| `<VCListItem>` | `default` | `{ data, index, classes, isSelected, isFocused, isDisabled, isActive, isSelectable, toggle }` |
| `<VCListEmpty>` | `default` | `{ data, busy }` |
| `<VCListLoading>` | `default` | `{ busy, overlay }` |

## Theme keys

Five entries on `ThemeElements`:

| Component | Slot keys |
|-----------|-----------|
| `list` | `root`, `header`, `footer` |
| `listBody` | `root` |
| `listItem` | `root`, `text`, `actions` |
| `listEmpty` | `root` |
| `listLoading` | `root` |

Variant axes registered by the bundled themes:

| Component | Axis | Values |
|---|---|---|
| `list` | `density` | `compact` / `normal` / `spacious` |
| `listItem` | `density` | (same) |
| `listItem` | `disabled` / `active` / `selected` | boolean — auto-folded from `<VCListItem>`'s props + the row's selection state |
| `listLoading` | `overlay` | boolean — auto-folded from `<VCListLoading :overlay>` |

## Behavioral defaults

| Component | Key | Default |
|-----------|-----|---------|
| `listEmpty` | `content` | `'No data available...'` |

Override globally for i18n:

```ts
app.use(vuecs, {
    defaults: {
        listEmpty: { content: computed(() => t('list.empty')) },
    },
});
```

## Migration from `@vuecs/list-controls`

```vue
<!-- Before (@vuecs/list-controls 2.x) -->
<VCList
    :data="users"
    :busy="loading"
    item-text-prop-name="email"
    :item-theme-class="{ root: 'border-b' }"
/>

<!-- After (@vuecs/list) -->
<VCList :data="users" :busy="loading">
    <template #default="{ classes }">
        <VCListBody>
            <template #item="{ data }">
                <VCListItem :data="data" :theme-class="{ root: 'border-b' }">
                    <template #default="{ classes: itemClasses }">
                        <span :class="itemClasses.text">{{ data.email }}</span>
                    </template>
                </VCListItem>
            </template>
        </VCListBody>
    </template>
</VCList>
```

| Before | After |
|--------|-------|
| `headerThemeClass` / `bodyThemeClass` / `itemThemeClass` / … on `<VCList>` | each part owns its own `themeClass` |
| `header` / `footer` / `body` / `loading` / `noMore` boolean props | omit the part to skip it; render header / footer via consumer markup using slot-prop `classes` |
| `<VCListHeader>` / `<VCListFooter>` | gone — render your own `<header>` / `<footer>` with `classes.header` / `classes.footer` from the default slot prop |
| `<VCListItemText>` / `<VCListItemActions>` | gone — render your own `<span>` with `itemClasses.text` / `itemClasses.actions` from `<VCListItem>`'s default slot prop |
| `<VCListNoMore>` | `<VCListEmpty>` (same self-conditioning, accurate name) |
| `slotProps` prop threaded through every sub-component | gone — use `useList()` / `useListItem()` from child components |
| `created` / `updated` / `deleted` slot helpers | gone — consumers handle their own mutation (use `list.apply*()` or `list.create/update/delete`) |
| `load: ListLoadFn` + `meta` props | gone — put callbacks / cursor / filter state in `defineList({ meta: { … } })` |
| `@vuecs/list-controls` package name | `@vuecs/list` |

## See also

- [Theme System](/guide/theme-system)
- [Behavioral Defaults](/guide/behavioral-defaults)
