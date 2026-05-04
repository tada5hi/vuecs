# List

Compound list components: a stateful root (`VCList`) plus thin part components (`VCListHeader`, `VCListBody`, `VCListItem`, `VCListItemText`, `VCListItemActions`, `VCListFooter`, `VCListLoading`, `VCListEmpty`) that read shared state from a context provider. Plus a `defineList()` composable that holds the state container and lets consumers extend it with arbitrary helpers (per-row mutation, pagination callbacks, refresh, …).

```bash
npm install @vuecs/list
```

::: warning Renamed from `@vuecs/list-controls`
This package is the successor to `@vuecs/list-controls@2.x`. It's a clean break — no shim, no compat layer. The old prop-drilled `<VCList>` with embedded `created`/`updated`/`deleted` slot helpers is gone; the compound API + `defineList()` replace it. See [Migration from `@vuecs/list-controls`](#migration-from-vuecs-list-controls) below.
:::

## Basic usage

<Playground name="list">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCList,
    VCListItem,
    VCListItemActions,
    VCListItemText,
} from '@vuecs/list';
import { ref } from 'vue';

type Fruit = { id: number; name: string; stock: number };

const data = ref<Fruit[]>([
    { id: 1, name: 'Apples', stock: 12 },
    { id: 2, name: 'Oranges', stock: 5 },
    { id: 3, name: 'Pears', stock: 8 },
]);

function remove(id: number): void {
    data.value = data.value.filter((row) => row.id !== id);
}
</script>

<template>
    <VCList :data="data">
        <template #item="{ data: item }">
            <VCListItem :data="item">
                <VCListItemText>
                    <span class="font-medium">{{ item.name }}</span>
                    <span class="text-xs text-fg-muted">
                        {{ item.stock }} in stock
                    </span>
                </VCListItemText>
                <VCListItemActions>
                    <button type="button" @click="remove(item.id)">Remove</button>
                </VCListItemActions>
            </VCListItem>
        </template>
        <template #empty>Nothing left — add some fruit.</template>
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

## Two composition modes

`<VCList>` accepts either named-slot **shorthand** or explicit **compound** children — never both. Detected automatically from your slot usage; mixing the two emits `console.warn` in dev.

### Shorthand mode

Pick this when you want the default skeleton (`Header → Body → Loading → Empty → Footer`). Set any of `#header` / `#item` / `#loading` / `#empty` / `#footer`; `<VCList>` auto-composes the parts.

```vue
<VCList :data="users" :busy="loading" :total="total">
    <template #header>Users</template>
    <template #item="{ data }">
        <VCListItem :data="data">
            <VCListItemText>{{ data.email }}</VCListItemText>
        </VCListItem>
    </template>
    <template #footer>{{ users.length }} of {{ total }}</template>
</VCList>
```

### Compound mode

Pick this when you want explicit control — skip a section, reorder, wrap a part in extra markup, swap `<VCListBody>` for a virtual-scrolling iterator, …

```vue
<VCList :data="users" :busy="loading" :total="total">
    <VCListHeader>Users</VCListHeader>
    <VCListBody>
        <template #item="{ data }">
            <VCListItem :data="data">
                <VCListItemText>{{ data.email }}</VCListItemText>
                <VCListItemActions>
                    <button @click="edit(data)">Edit</button>
                </VCListItemActions>
            </VCListItem>
        </template>
    </VCListBody>
    <VCListFooter>{{ users.length }} of {{ total }}</VCListFooter>
</VCList>
```

### Row layout

`<VCListItem>` is a flex row. `<VCListItemText>` takes `flex-1` so it consumes available space; any number of `<VCListItemActions>` clusters trail it without fighting for position.

```vue
<VCListItem :data="user">
    <VCListItemText>{{ user.email }}</VCListItemText>

    <!-- Primary actions cluster -->
    <VCListItemActions>
        <button @click="edit(user)">Edit</button>
        <button @click="remove(user)">Delete</button>
    </VCListItemActions>

    <!-- Overflow cluster — sits next to primary, no `ml-auto` race -->
    <VCListItemActions>
        <button @click="openMenu(user)">⋯</button>
    </VCListItemActions>
</VCListItem>
```

For full custom rendering, drop sub-components and use the default slot directly:

```vue
<VCListItem :data="data" asChild>
    <article class="my-card">{{ data.name }}</article>
</VCListItem>
```

## `defineList()` composable

The state container. `<VCList>` constructs a minimal one internally when only `data` / `busy` / `total` / `meta` are passed; for shared state across views or extensible helpers, build your own and pass via `:state`.

```ts
import { defineList } from '@vuecs/list';

const users = ref<User[]>([]);

const list = defineList({
    data: users,                              // ref / getter / plain
    setData: (next) => { users.value = next; },  // OPTIONAL — see below
    busy: loading,
    total,
    itemId: (u) => u.id,                      // identity hint for findIndex / applyUpdate

    mergeOnUpdated: true,                     // apply { ...existing, ...patch } on update

    // Anything that's not first-class state goes into the typed `meta` bag —
    // pagination cursors, filter state, callbacks (`refresh`, `load`),
    // helper flags. Forwarded verbatim to `list.meta`; nested Refs / closures
    // stay as-is so consumers manage reactivity inside the bag themselves.
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
// list.findIndex(item)
// list.applyCreate(arr, item) / applyUpdate / applyDelete  — pure helpers honoring flags
// list.create(item) / update / delete                — bound mutators (when a writer is derivable)
```

```vue
<VCList :state="list">
    <template #item="{ data, meta }">         <!-- slot props are list.* -->
        <button @click="meta.refresh()">Reload</button>
        ...
    </template>
</VCList>
```

### Mutation: pure helpers vs. bound mutators

`defineList()` exposes ergonomic `create` / `update` / `delete` mutators whenever a writer can be derived from the input:

```ts
// data is a Ref → mutators are wired automatically:
const users = ref<User[]>([]);
const list = defineList({ data: users });
list.create(item);   // ≡ users.value = applyCreate(users.value, item)
list.update(item);
list.delete(item);

// data is a getter or plain array → no auto-write path; pass setData to opt in:
const list = defineList({
    data: () => store.users,
    setData: (next) => store.replaceUsers(next),
});
list.create(item);   // routes through the store action

// Explicit setData also overrides the auto-derived setter on a Ref source —
// useful for hooking side effects (logging, optimistic UI, etc.):
const list = defineList({
    data: users,
    setData: (next) => { logChange(next); users.value = next; },
});
```

The pure `applyCreate` / `applyUpdate` / `applyDelete` helpers are always exposed — when you want full control, the explicit-write path stays available:

```ts
const list = defineList({ data: users });
users.value = list.applyCreate(users.value, item);
```

All three flag-honoring forms share the same semantics; the difference is whether the composable does the assignment for you.

**Resolution order for the writer:**

1. Explicit `setData` — wins unconditionally
2. `data` is a `Ref<T[]>` — auto-derived setter (`(next) => { ref.value = next }`)
3. Otherwise (getter / plain array, no `setData`) — no mutators; only the pure helpers

## Props

### `<VCList>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `ListState` | — | Pre-built state from `defineList()`. When set, the simple props are ignored. |
| `data` | `T[]` | `[]` | Items (used when `state` is omitted) |
| `busy` | `boolean` | `false` | Loading flag (used when `state` is omitted) |
| `total` | `number` | `data.length` | Server-side total (used when `state` is omitted) |
| `meta` | `Record<string, unknown>` | — | Verbatim metadata bag (used when `state` is omitted; snapshotted at setup) |
| `tag` | `string` | `'div'` | Root element tag |
| `asChild` | `boolean` | `false` | Reka-style: clone the default slot's first vnode instead of emitting a wrapper |
| `themeClass` | `Partial<ListThemeClasses>` | — | Slot class overrides |
| `themeVariant` | `Record<string, string \| boolean>` | — | Variant overrides |

### `<VCListItem>`

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T` | The item record (forwarded to slot props) |
| `index` | `number` | Position in the iterating body |
| `tag` | `string` | Default `'div'` |
| `asChild` | `boolean` | Default `false` — clone the default slot's first vnode instead of wrapping |
| `themeClass` | `Partial<ListItemThemeClasses>` | Override `root` |

The remaining parts (`Header`, `Body`, `Item`, `ItemText`, `ItemActions`, `Footer`, `Loading`, `Empty`) all take `tag`, `asChild`, `themeClass`, `themeVariant`.

## Slots

| Component | Slot | Slot props | Notes |
|-----------|------|------------|-------|
| `VCList` (shorthand) | `header` / `item` / `loading` / `empty` / `footer` | `defineList()` state (+ `data` / `index` for `item`) | Triggers shorthand mode |
| `VCList` (compound) | `default` | `defineList()` state | Compound child rendering |
| `VCListBody` | `item` | `{ data, index, …state }` | Auto-iterates `state.data` per row |
| `VCListBody` | `default` | `defineList()` state | Bypasses iteration — escape hatch for virtual scrolling, etc. |
| `VCListItem` | `default` | `{ data, index }` | Row contents (compose `VCListItemText` / `VCListItemActions` here) |
| `VCListItemText` | `default` | — | The text/content area of a row |
| `VCListItemActions` | `default` | — | A right-trailing action cluster (render multiple for multi-cluster layouts) |

## Theme keys

| Component | Keys |
|-----------|------|
| `list` | `root` |
| `listHeader` | `root` |
| `listBody` | `root` |
| `listItem` | `root` |
| `listItemText` | `root` |
| `listItemActions` | `root` |
| `listFooter` | `root` |
| `listLoading` | `root` |
| `listEmpty` | `root` |

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
    :total="total"
    item-text-prop-name="email"
    :item-theme-class="{ root: 'border-b' }"
    @updated="onUpdate"
/>

<!-- After (@vuecs/list) -->
<VCList :data="users" :busy="loading" :total="total">
    <template #item="{ data }">
        <VCListItem :data="data" :theme-class="{ root: 'border-b' }">
            <VCListItemText>{{ data.email }}</VCListItemText>
        </VCListItem>
    </template>
</VCList>

<!-- Wire onUpdate to the consumer's button handler — the package no longer
     emits create/update/delete events. Use list.applyUpdate() if you want
     the merge semantics.  -->
```

| Before | After |
|--------|-------|
| `headerThemeClass` / `bodyThemeClass` / `itemThemeClass` / … on `<VCList>` | each part owns its own `themeClass` |
| `header` / `footer` / `body` / `loading` / `noMore` boolean props on `<VCList>` | omit the part to skip it |
| `itemTag` / `itemIcon` / `itemText` / `itemTextPropName` / `itemActions` on `<VCList>` | move to `<VCListItem>` + `<VCListItemText>` / `<VCListItemActions>` children |
| `<VCListItem>` `text` / `actions` / `actionsExtra` slots | dedicated `<VCListItemText>` / `<VCListItemActions>` sub-components (compose multiple for what was `actionsExtra`) |
| `noMoreContent` prop on `<VCList>` | put text inside `<VCListEmpty>` or use `defaults.listEmpty.content` |
| `<VCListNoMore>` | `<VCListEmpty>` (same self-conditioning, accurate name) |
| `slotProps` prop threaded through every sub-component | gone — children read context |
| `created` / `updated` / `deleted` slot helpers | gone — consumers handle their own list mutation (use `list.apply*()`) |
| `load: ListLoadFn` + `meta` props | gone — put callbacks / cursor / filter state in `defineList({ meta: { … } })` |
| `@vuecs/list-controls` package name | `@vuecs/list` |

## See also

- [Theme System](/guide/theme-system)
- [Behavioral Defaults](/guide/behavioral-defaults)
