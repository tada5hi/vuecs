# List

Compound list components: a stateful root (`VCList`) plus thin part components (`VCListHeader`, `VCListBody`, `VCListItem`, `VCListFooter`, `VCListLoading`, `VCListNoMore`) that read shared state from a context provider. Plus a `useList()` composable that holds the state container and lets consumers extend it with arbitrary helpers (per-row mutation, pagination callbacks, refresh, …).

```bash
npm install @vuecs/list
```

::: warning Renamed from `@vuecs/list-controls`
This package is the successor to `@vuecs/list-controls@2.x`. It's a clean break — no shim, no compat layer. The old prop-drilled `<VCList>` with embedded `created`/`updated`/`deleted` slot helpers is gone; the compound API + `useList()` replace it. See [Migration from `@vuecs/list-controls`](#migration-from-vuecs-list-controls) below.
:::

## Basic usage

<Demo name="list">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCList, VCListItem } from '@vuecs/list';
import { ref } from 'vue';

const data = ref([
    { id: 1, name: 'Apples' },
    { id: 2, name: 'Oranges' },
    { id: 3, name: 'Pears' },
]);
</script>

<template>
    <VCList :data="data">
        <template #item="{ data: item }">
            <VCListItem :data="item">
                <template #text>{{ item.name }}</template>
            </VCListItem>
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
</Demo>

## Two composition modes

`<VCList>` accepts either named-slot **shorthand** or explicit **compound** children — never both. Detected automatically from your slot usage; mixing the two emits `console.warn` in dev.

### Shorthand mode

Pick this when you want the default skeleton (`Header → Body → Loading → NoMore → Footer`). Set any of `#header` / `#item` / `#loading` / `#noMore` / `#footer`; `<VCList>` auto-composes the parts.

```vue
<VCList :data="users" :busy="loading" :total="total">
    <template #header>Users</template>
    <template #item="{ data }">
        <VCListItem :data="data">
            <template #text>{{ data.email }}</template>
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
                <template #text>{{ data.email }}</template>
            </VCListItem>
        </template>
    </VCListBody>
    <VCListFooter>{{ users.length }} of {{ total }}</VCListFooter>
</VCList>
```

## `useList()` composable

The state container. `<VCList>` constructs a minimal one internally when only `data` / `busy` / `total` / `meta` are passed; for shared state across views or extensible helpers, build your own and pass via `:state`.

```ts
import { useList } from '@vuecs/list';

const list = useList({
    data: users,                    // ref / getter / plain
    busy: loading,
    total,
    meta,                           // pagination cursor, filters, …
    itemId: (u) => u.id,            // identity hint for findIndex / applyUpdate

    mergeOnUpdate: true,            // apply { ...existing, ...patch } on update

    // Arbitrary extras flow to slot props:
    refresh: () => fetch('/users'),
});

// list.data           — ComputedRef<T[]>
// list.busy           — ComputedRef<boolean>
// list.total          — ComputedRef<number>            (data.length fallback)
// list.meta           — ComputedRef<M | undefined>
// list.isEmpty        — ComputedRef<boolean>           (!busy && total === 0)
// list.findIndex(item)
// list.applyCreate(arr, item) / applyUpdate / applyDelete  — pure helpers honoring flags
// list.refresh        — your own pass-through field
```

```vue
<VCList :state="list">
    <template #item="{ data, refresh }">      <!-- slot props are list.* -->
        ...
    </template>
</VCList>
```

`useList()` is **state-only** — no event emission, no automatic mutation. The `applyCreate` / `applyUpdate` / `applyDelete` helpers return a *new* array honoring the configured flags; you wire them into your own mutation flow.

## Props

### `<VCList>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `UseListReturn` | — | Pre-built state from `useList()`. When set, the simple props are ignored. |
| `data` | `T[]` | `[]` | Items (used when `state` is omitted) |
| `busy` | `boolean` | `false` | Loading flag (used when `state` is omitted) |
| `total` | `number` | `data.length` | Server-side total (used when `state` is omitted) |
| `meta` | `M` | — | Caller metadata (used when `state` is omitted) |
| `tag` | `string` | `'div'` | Root element tag |
| `themeClass` | `Partial<ListThemeClasses>` | — | Slot class overrides |
| `themeVariant` | `Record<string, string \| boolean>` | — | Variant overrides |

### `<VCListItem>`

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T` | The item record (forwarded to slots) |
| `index` | `number` | Position in the iterating body |
| `tag` | `string` | Default `'div'` |
| `themeClass` | `Partial<ListItemThemeClasses>` | Slot class overrides for `root` / `textWrapper` / `actionsWrapper` / `actionsExtraWrapper` |

The other parts (`Header`, `Body`, `Footer`, `Loading`, `NoMore`) take only `tag`, `themeClass`, `themeVariant`.

## Slots

| Component | Slot | Slot props | Notes |
|-----------|------|------------|-------|
| `VCList` (shorthand) | `header` / `item` / `loading` / `noMore` / `footer` | `useList()` state (+ `data` / `index` for `item`) | Triggers shorthand mode |
| `VCList` (compound) | `default` | `useList()` state | Compound child rendering |
| `VCListBody` | `item` | `{ data, index, …state }` | Auto-iterates `state.data` per row |
| `VCListBody` | `default` | `useList()` state | Bypasses iteration — escape hatch for virtual scrolling, etc. |
| `VCListItem` | `default` | `{ data, index }` | Full override of the item row |
| `VCListItem` | `text` / `actions` / `actionsExtra` | `{ data, index }` | Layout slots |

## Theme keys

| Component | Keys |
|-----------|------|
| `list` | `root` |
| `listHeader` | `root` |
| `listBody` | `root` |
| `listItem` | `root`, `textWrapper`, `actionsWrapper`, `actionsExtraWrapper` |
| `listFooter` | `root` |
| `listLoading` | `root` |
| `listNoMore` | `root` |

## Behavioral defaults

| Component | Key | Default |
|-----------|-----|---------|
| `listNoMore` | `content` | `'No data available...'` |

Override globally for i18n:

```ts
app.use(vuecs, {
    defaults: {
        listNoMore: { content: computed(() => t('list.empty')) },
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
            <template #text>{{ data.email }}</template>
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
| `itemTag` / `itemIcon` / `itemText` / `itemTextPropName` / `itemActions` on `<VCList>` | move to `<VCListItem>` slots |
| `noMoreContent` prop on `<VCList>` | put text inside `<VCListNoMore>` or use `defaults.listNoMore.content` |
| `slotProps` prop threaded through every sub-component | gone — children read context |
| `created` / `updated` / `deleted` slot helpers | gone — consumers handle their own list mutation (use `list.apply*()`) |
| `load: ListLoadFn` + `meta` props | gone — pass them through `useList()` extras |
| `@vuecs/list-controls` package name | `@vuecs/list` |

## See also

- [Theme System](/guide/theme-system)
- [Behavioral Defaults](/guide/behavioral-defaults)
