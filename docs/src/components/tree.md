# Tree

Tree view for nested data — a folder pane, a permission tree, a category picker. `<VCTree>` **selects** rather than navigates: a click writes a key into `v-model:selection` instead of changing the route. (For a nav that routes, reach for [`<VCNavItems>`](/components/navigation).)

```bash
npm install @vuecs/tree
```

Built on Reka UI's `TreeRoot` / `TreeItem`, which contribute roving focus, `↑` / `↓` / `Home` / `End`, `←` / `→` collapse-expand, typeahead and the `role="treeitem"` / `aria-level` scaffolding. vuecs owns everything stateful on top: key-based selection, controlled expansion, the cascade + `aria-checked="mixed"`, and lazy children.

Selection is **keys, never item objects** — so the selected value drops straight into a `?path=` query parameter and reads back out without a lookup table. `parseTreePaths()` is the other half of that story: it turns a flat list of delimited paths into nested nodes whose `id` is the full path.

<Playground name="tree">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { ref } from 'vue';
import { VCTree, parseTreePaths } from '@vuecs/tree';

// `id` is the FULL path ('users/employees'), `label` the last segment.
const items = parseTreePaths([
    'users',
    'users/employees',
    'users/admins',
    'sources',
    'sources/ldap',
]);

const selection = ref<string | null>('users/employees');
const expanded = ref<string[]>(['users']);
</script>

<template>
    <VCTree
        v-model:selection="selection"
        v-model:expanded="expanded"
        :items="items"
    />

    <p>?path=<code>{{ selection ?? '—' }}</code></p>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/tree";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## Items & accessors

`:items` takes any shape. Out of the box a node is understood when it carries `id` (the identity ladder's fallback) and an `Array`-valued `children` (the `getChildren` fallback) — exactly what `parseTreePaths()` produces. Anything else is wired with accessor props:

```vue
<VCTree
    :items="folders"
    :item-id="(folder) => folder.uuid"
    :get-children="(folder) => folder.nodes"
    :get-label="(folder) => folder.title"
    :item-disabled="(folder) => folder.readonly"
/>
```

`<VCTree>` is **generic over `Item`**, so the type flows from `:items` into every accessor and into the `#item` slot props — no cast at the call site.

### `parseTreePaths()`

```ts
import { parseTreePaths } from '@vuecs/tree';

parseTreePaths(['users', 'users/employees', 'sources/ldap']);
// [
//   { id: 'users',   label: 'users',   children: [{ id: 'users/employees', label: 'employees' }] },
//   { id: 'sources', label: 'sources', children: [{ id: 'sources/ldap',    label: 'ldap' }] },
// ]
```

- Each node's `id` is its **full path**; `label` is the last segment.
- Intermediate nodes are synthesised even when never listed (`sources` above).
- A path listed twice collapses into one node; first-seen order is preserved at every level.
- Empty segments (leading / trailing / doubled delimiters) are ignored.
- The delimiter is the second argument (`parseTreePaths(paths, '.')`).

## Selection

`v-model:selection` carries **keys**. The shape follows `:multiple`:

```vue
<!-- single — a bare key, or null -->
<VCTree v-model:selection="key" :items="items" />

<!-- multi — an array of keys -->
<VCTree v-model:selection="keys" multiple :items="items" />
```

Pointer semantics inside a multi tree: plain click toggles, `Ctrl` / `Cmd` + click toggles one without clearing the rest, `Shift` + click extends a range from the last-clicked anchor.

::: warning Modifiers do not apply under `:cascade`
With `:cascade` on, a click always cascades the clicked branch through its whole
subtree, so `Shift` and `Ctrl` / `Cmd` are ignored. A range or a single-row toggle
has no coherent meaning once selecting a parent implies selecting its descendants.
:::

A key that isn't in the tree — a deep-linked `?path=` whose branch hasn't loaded yet — is **preserved** at the tail of the emitted array rather than dropped.

### Cascade

`:cascade` (which requires `:multiple`) makes a branch's state its subtree's state: selecting a parent selects every enabled descendant, and a partially-selected branch reports `aria-checked="mixed"`.

```vue
<VCTree v-model:selection="keys" :items="items" multiple cascade />
```

The cascade is derived from the **whole** tree, not the visible rows, so a collapsed parent updates correctly. It is also idempotent, which is what lets a non-normalised seed value (a restored deep link, say) render correctly on first paint.

Cascade flips the row from the WAI-ARIA *tree* pattern to the *tree with checkboxes* pattern: rows carry `aria-checked` (`"true"` / `"false"` / `"mixed"`) instead of `aria-selected`. The rendered ARIA therefore changes with the prop — worth knowing if you assert on it in tests.

## Expansion

`v-model:expanded` is an array of keys; `:default-expanded` seeds it when you don't bind one.

```vue
<VCTree :items="items" :default-expanded="['users']" />
```

Expanding is not selecting: the chevron stops its own click, and a pointer click on the row selects only. `←` / `→` on the focused row collapse / expand it (and `→` on a collapsed branch is what triggers a lazy load from the keyboard).

## Lazy children

Pair `:load` with `:has-children`. `:has-children` marks a branch expandable *before* anything is fetched; `:load` resolves its children the first time it is opened. Loaded children are held in an overlay — `:items` stays a pure input you still own.

```vue
<VCTree
    :items="roots"
    :has-children="(item) => item.type === 'folder'"
    :load="(item) => api.folders.children(item.id)"
    @load-error="({ item, error }) => notify(item, error)"
/>
```

While a branch is fetching, its row carries `aria-busy="true"` and the trigger `data-loading`. A rejected `:load` emits `load-error` and leaves the branch collapsed. With `:cascade` on, a selected parent adopts children that arrive later.

## Slots

```vue
<VCTree :items="items">
    <template #item="{ item, itemKey, selected, classes }">
        <VCIcon :name="item.icon" :class="classes.icon" />
        <span :class="classes.label">{{ item.label }}</span>
        <VCBadge v-if="selected" size="xs">current</VCBadge>
    </template>

    <template #toggle="{ expanded, loading, toggle }">
        <button type="button" @click.stop="toggle">
            {{ loading ? '…' : (expanded ? '▾' : '▸') }}
        </button>
    </template>

    <template #empty>No folders.</template>
</VCTree>
```

| Slot | Props |
|---|---|
| `item` | `{ item, itemKey, level, expanded, selected, indeterminate, loading, hasChildren, classes, toggle, select }` — replaces the default label span. `classes` is the resolved `treeItem` slot-class map. |
| `toggle` | `{ itemKey, expanded, loading, toggle }` — replaces `<VCTreeItemTrigger>` on branches. |
| `empty` | — rendered when the tree resolves to no rows. |

## `<VCTree>` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `Item[]` | `[]` | The **full** tree (see [Limitations](#limitations)). |
| `itemId` | `(item: Item) => string \| number` | `undefined` | Highest priority in the identity ladder. |
| `itemKey` | `string \| ((item: Item) => …)` | `undefined` | Field (or resolver) holding the key. Falls back to `.id`. |
| `getChildren` | `(item: Item) => Item[] \| undefined` | `undefined` | Falls back to an `Array`-valued `.children`. |
| `getLabel` | `(item: Item) => string` | `undefined` | Falls back to `.label`, then the key. |
| `itemDisabled` | `(item: Item) => boolean` | `undefined` | Mark individual rows non-interactive. |
| `selection` | `string \| string[] \| null` | `null` | Selected key(s). Use `v-model:selection`. |
| `multiple` | `boolean` | `false` | Allow more than one selected row. |
| `cascade` | `boolean` | `false` | Parent ⇄ subtree propagation + `aria-checked="mixed"`. Requires `multiple`. |
| `expanded` | `string[]` | `undefined` | Expanded keys. Use `v-model:expanded`. |
| `defaultExpanded` | `string[]` | `undefined` | Seeds expansion when `expanded` is not bound. |
| `load` | `(item: Item) => Promise<Item[]>` | `undefined` | Fetch a branch's children on first expand. |
| `hasChildren` | `(item: Item) => boolean` | `undefined` | Report that a branch has children before they load. |
| `disabled` | `boolean` | `false` | Disable the whole tree. |
| `maxDepth` | `number` | `100` | Guard against a cyclic `getChildren`; deeper items are dropped with a dev warning. |
| `as` | `string \| Component` | `'ul'` | Render target for the tree container. |
| `guides` | `boolean` | `false` | Draw `\|` / `└─` connector rails in the indent gutters, the way a file explorer does. |
| `themeClass` / `themeVariant` | | | Per-instance theme overrides (`tree` slot map). |
| `itemThemeClass` | `ThemeClassesOverride<TreeItemThemeClasses>` | `undefined` | Theme-class overrides applied to **every row**. |
| `itemThemeVariant` | `VariantValues` | `undefined` | Theme-variant values applied to every row — e.g. `:item-theme-variant="{ size: 'sm' }"` for a compact tree. |

::: tip Why a separate pair for rows?
Rows are rendered by the driver, not by you, so there is no `<VCTreeItem>` call site to put
`themeClass` / `themeVariant` on. `itemThemeClass` / `itemThemeVariant` are that call site —
without them a theme's `treeItem` variant axes (`@vuecs/theme-tailwind` ships a `size` axis)
would be reachable only through app-level `overrides`.
:::

Reka's `modelValue` / `defaultValue`, its own `multiple`, `propagateSelect` / `bubbleSelect` and `selectionBehavior` are **deliberately not forwarded** — key-based `selection`, `multiple` and `cascade` replace them, and vuecs owns selection end to end.

## Events

| Event | Payload | Fired |
|---|---|---|
| `update:selection` | `string \| string[] \| null` | Selection changed. |
| `update:expanded` | `string[]` | A branch expanded or collapsed. |
| `select` | `{ key, item }` | A row was activated (before the selection write). |
| `load-error` | `{ key, item, error }` | `:load` rejected. |

## Parts

| Component | Notes |
|---|---|
| `<VCTree>` | Root `<ul role="tree">` + driver. Generic over `Item`. |
| `<VCTreeItem>` | One `<li role="treeitem">` row. Generic over `Item`; rendered by the driver, exported for custom compositions. |
| `<VCTreeItemTrigger>` | The expand / collapse chevron. Decorative (`aria-hidden`, not focusable) — the row itself is the control per the APG TreeView pattern. |

## Utilities

All Vue-free and individually importable:

| Export | Purpose |
|---|---|
| `parseTreePaths(paths, delimiter?)` | Flat delimited paths → nested `TreeNode[]`. |
| `buildTreeIndex(items, resolveKey, getChildren, options?)` | Whole-tree index (nodes, pre-order, root keys). |
| `normalize(index, selected)` | Derive every ancestor's state bottom-up → `{ selected, indeterminate }`. |
| `cascadeSelect(index, current, key, on)` | Select / deselect a key and its subtree. |
| `orderKeys(index, selected)` | Emit selected keys in pre-order, unresolved keys preserved at the tail. |

## State attributes

Rendered on the row (`<li>`), for themes and consumer CSS:

| Attribute | Meaning |
|---|---|
| `aria-selected="true\|false"` | Plain (non-cascade) selection. |
| `aria-checked="true\|false\|mixed"` | Cascade mode — replaces `aria-selected`. |
| `data-selected` / `data-indeterminate` | Same state, attribute-selector friendly. |
| `aria-expanded` / `data-expanded` | Branch state. |
| `aria-busy="true"` | Children loading. |
| `aria-disabled="true"` / `data-disabled` | Row disabled. |
| `data-indent="N"` | 1-based depth. |

The trigger carries `data-state="open\|closed"` and `data-loading`.

## Theme keys

| Key | Slot keys |
|---|---|
| `tree` | `root`, `empty` |
| `treeItem` | `root`, `content`, `trigger`, `triggerIcon`, `rail`, `icon`, `label` |

`<VCTreeItemTrigger>` resolves against the same `treeItem` key (`trigger` / `triggerIcon`), so it adds no third entry.

**Indentation is not a theme concern.** Rows are a flat list (the visible tree is flattened into siblings), so depth is painted rather than inherited from DOM nesting: each row carries `--vc-tree-level` inline, and the package's own structural CSS steps it by `--vc-tree-indent` (default `0.75rem`). A theme that needs a different rhythm overrides that one token on `.vc-tree` rather than writing a rule per level:

```css
.vc-tree { --vc-tree-indent: 1.25rem; }
```

## Limitations

Known and deliberate — documented rather than papered over:

- **`Shift` + arrow range-select is not supported.** `Shift` + **click** is. The arrow variant is inert upstream in Reka (its range anchor is only assigned on a code path the default selection behaviour never reaches), so wiring it would mean reimplementing the keyboard handler.
- **Typeahead includes non-character keys.** Reka's `TreeRoot` feeds every `event.key` into its typeahead buffer without filtering modifiers or arrows, so `ArrowDown` appends the literal `'ArrowDown'`. Inherited; not fixable from outside the primitive.
- **No virtualization.** Large trees render every visible row. Reka's `TreeVirtualizer` reroutes keydown handling and breaks the visible-order assumptions selection relies on, so it is out of scope.
- **`:items` must be the FULL tree when `:cascade` is on.** Passing a filtered subset gives wrong parent state: a branch whose non-matching children were filtered out looks fully selected and gets promoted, emitting a key the user never clicked. Filter for display with `#item`, not by shrinking `:items`.
- **A disabled child does not block its parent from reporting fully selected.** Disabled rows are skipped when a branch's state is derived. The alternative — an unreachable child holding its parent permanently indeterminate, with no way for the user to resolve it — is worse.
- **Stale keys are never evicted.** Keys absent from the index are preserved (that is what makes deep links and lazy branches work), so a key whose item was genuinely deleted stays in the model until you remove it.
- **No `*` expand-all shortcut and no focus wrap** (`loop`) — neither is implemented in the underlying primitive.
