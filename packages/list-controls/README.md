# @vuecs/list-controls 📋

[![npm version](https://badge.fury.io/js/@vuecs%2Flist-controls.svg)](https://badge.fury.io/js/@vuecs%2Flist-controls)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

List display components for Vue 3 with header, footer, body, loading state, empty state, and item-level event handling (created/updated/deleted).

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
- [Slots](#slots)
- [Global Behavioral Defaults (i18n)](#global-behavioral-defaults-i18n)
- [Typed Slot Props](#typed-slot-props)
- [Theme Slots](#theme-slots)
- [License](#license)

## Installation

```bash
npm install @vuecs/list-controls @vuecs/core
```

## Quick Start

```typescript
import listControls from '@vuecs/list-controls';

app.use(listControls);
```

```vue
<template>
    <VCList
        :data="items"
        :busy="loading"
        :total="total"
        @created="onCreated"
        @deleted="onDeleted"
    >
        <template #item="{ data, deleted }">
            <span>{{ data.name }}</span>
            <button @click="deleted()">Remove</button>
        </template>
    </VCList>
</template>
```

Or with render functions:

```typescript
import { VCList } from '@vuecs/list-controls';

h(VCList, { data: items, total: items.length }, {
    item: ({ data }) => h('span', data.name),
});
```

## Components

| Component | Description |
|-----------|-------------|
| `VCList` | Container — orchestrates header, body, loading, noMore, footer |
| `VCListBody` | Renders data items via `VCListItem` |
| `VCListItem` | Single item with icon, text, and actions sections |
| `VCListHeader` | Header section (renders only when slot has content) |
| `VCListFooter` | Footer section (renders only when slot has content) |
| `VCListLoading` | Loading indicator (visible when `busy` is true) |
| `VCListNoMore` | Empty state (visible when not busy and total is 0) |

## Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | `{ data, busy, total, load, created, updated, deleted }` | Replaces all structure |
| `header` | `{ busy, total, load }` | Header content |
| `footer` | `{ busy, total, load }` | Footer content |
| `body` | `{ data, busy, total }` | Body content (replaces item rendering) |
| `item` | `{ data, index, updated, deleted }` | Per-item content |
| `itemActions` | `{ data, index, updated, deleted }` | Per-item actions |
| `loading` | `{ busy }` | Loading indicator content |
| `noMore` | `{}` | Empty state content |

## Global Behavioral Defaults (i18n)

Text content and behavioral flags that are hardcoded per-component can be overridden globally via the `defaults` option on the core plugin. Values may be plain strings, `ref`, or `computed` (reactive sources unwrap automatically — ideal for i18n). See [@vuecs/core — Global Behavioral Defaults](../core/README.md#global-behavioral-defaults) for the full resolution chain.

```typescript
import { computed } from 'vue';
import vuecs from '@vuecs/core';
import listControls from '@vuecs/list-controls';

app.use(vuecs, {
    defaults: {
        listNoMore: {
            content: computed(() => t('list.no_more')),
        },
        listItem: {
            textPropName: 'label', // or e.g. 'title' for CMS entities
        },
    },
});
app.use(listControls);
```

Per-instance props always win over global defaults.

### Configurable keys per component

| Component | Keys | Hardcoded fallback |
|-----------|------|--------------------|
| `VCListItem` | `textPropName` | `'name'` |
| `VCListNoMore` | `content` | `'No more items available...'` |

Global defaults apply both when using `VCListItem` / `VCListNoMore` directly and when rendering them through the `VCList` composite — `VCList` forwards the corresponding props (`itemTextPropName`, `noMoreContent`) as `undefined` by default so the child's defaults resolution runs unchanged.

## Typed Slot Props

Slot prop interfaces are exported for render-function consumers:

```typescript
import {
    VCList,
    type ListItemSlotProps,
    type ListSlotProps,
} from '@vuecs/list-controls';

interface Realm { id: string; name: string }

h(VCList<Realm>, { data: realms }, {
    item: (props: ListItemSlotProps<Realm>) => h('span', props.data.name),
});
```

| Export | Used by |
|--------|---------|
| `ListSlotProps<T, M>` | `VCList` default slot |
| `ListBaseSlotProps<T, M>` | `VCListHeader`, `VCListFooter`, `VCListLoading`, `VCListNoMore` default slot |
| `ListBodySlotProps<T, M>` | `VCListBody` default slot |
| `ListItemSlotProps<T>` | `VCListItem` default/actions/actionsExtra slots, `VCList` `item`/`itemActions`/`itemActionsExtra` slots |

## Theme Slots

| Component | Slot Keys |
|-----------|-----------|
| `list` | `root` |
| `listBody` | `root` |
| `listItem` | `root`, `icon`, `iconWrapper`, `textWrapper`, `actionsWrapper`, `actionsExtraWrapper` |
| `listHeader` | `root` |
| `listFooter` | `root` |
| `listLoading` | `root` |
| `listNoMore` | `root` |

## License

Made with 💚

Published under [MIT License](./LICENSE).
