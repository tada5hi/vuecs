# Tree

`<VCTree>` is a tree view that **selects** rather than navigates — the
counterpart to `@vuecs/navigation`'s `<VCNavItems>`, which resolves a
path and renders links. Three components: `<VCTree>` (root + driver),
`<VCTreeItem>` (one `treeitem` row), `<VCTreeItemTrigger>` (the
expand/collapse chevron). Layer 1 — `@vuecs/core` peer dep plus a
runtime `reka-ui` dep (`TreeRoot` / `TreeItem`).

Its own package rather than a folder in `@vuecs/navigation`: tree
consumers would otherwise inherit navigation's `@vuecs/link` peer dep
and its 327-line stylesheet, and the "Reka is already there" argument
is void — `reka-ui` is a plain dependency in seven packages.

### Reka is a focus/flatten shell — vuecs owns the state

`TreeRoot` is used for exactly four things: the **visible-row flatten**
(its `#default="{ flattenItems }"` slot), roving focus, typeahead, and
Left/Right sibling navigation. Everything else is vuecs's:

- **Reka's selection is never fed.** `modelValue` / `defaultValue` /
  `propagateSelect` / `bubbleSelect` / `selectionBehavior` are not
  passed, and `select` / `toggle` events are always
  `preventDefault()`ed. `<VCTree>`'s `cascade` prop carries a
  `Vuecs convention:` JSDoc line naming what it replaces.
- **One exception:** `multiple` *is* forwarded — not for selection, but
  because `TreeRoot` derives `aria-multiselectable` from it, and without
  it a multi-select tree renders several `aria-selected="true"` rows
  inside a tree that declares itself single-select. Setting the
  attribute as a fallthrough attr does **not** work: `TreeRoot` routes
  through `RovingFocusGroup`'s `as-child`, and `Slot` merges child-last,
  so reka's own `undefined` wins. Forwarding it also means reka's
  `modelValue` defaults to `[]` in multi mode, so `selectedKeys` takes
  its `.map()` branch and never constructs the phantom `{}` at all.
- **Consequence:** both verified upstream cascade defects become
  *unreachable dead code* rather than worked-around edge cases. See
  the cascade kernel below.

### DOM ownership via `as-child` (the load-bearing mechanism)

`<VCTreeItem>` renders Reka's `TreeItem` with **`as-child`**, so the
`<li>` vuecs writes is the element that reaches the DOM.

This is the only way to repaint Reka's ARIA from outside. `TreeItem.vue`
binds `v-bind="$attrs"` **before** its own `role` / `aria-selected`, so a
plain wrapper always loses — but `Primitive`'s `asChild` path routes
through `Slot`, which does `mergeProps(attrs, child.props)` with the
**child last**:

```ts
mergeProps({ 'aria-selected': 'false', role: 'treeitem' }, { 'aria-selected': undefined, 'aria-checked': 'mixed' })
// → { role: 'treeitem', 'aria-checked': 'mixed' }   ← aria-selected REMOVED
```

So our attributes outrank Reka's, and a value of `undefined` **removes**
an attribute outright — which is what lets a cascade row drop
`aria-selected` and switch to `aria-checked="mixed"`.

What vuecs keeps from Reka by *not* setting it: `role="treeitem"`,
`aria-level`, `aria-expanded`, `data-indent` (Reka's Left/Right
navigation resolves parents and children by reading it off the
collection), the roving `tabindex`, and the collection marker. `on*`
keys merge into an **array**, so Reka's keydown/click handlers still run
alongside ours on an element we own.

**This precedence is undocumented upstream.** A future reka-ui release
that "fixes" `asChild` precedence would silently revert every row to
`aria-selected="false"` without a type failure. Preserve the child-owned rendered attributes.

Two consequences worth knowing: a template `ref` on our `<li>` is
silently dropped (`Slot` deletes the child's `ref` to protect the
collection ref), and `as-child` pins `<VCTreeItem>` to exactly one root
element — a future row + inline-panel feature can't render two siblings
without changing the DOM contract themes depend on.

### Key-based v-model

`v-model:selection` carries **strings, not item objects** (`string |
string[] | null`; `:multiple` for the array form). The consumer writes
the key straight into a `?path=` query parameter, and
`v-model:expanded` uses keys in Reka. Two `useSelectionMachine`
instances from `@vuecs/core` back it — exactly `<VCTable>`'s precedent.

Keys the index doesn't know about (a deep-linked `?path=` whose branch
hasn't loaded) are **preserved at the tail** of the emitted array by
`orderKeys()`, so a round-trip through `v-model` doesn't drop them.

### `refKeys` — the `getKey({})` mount-time hazard

`TreeRoot` computes `selectedKeys` as `[props.getKey(modelValue ?? {})]`
in single-select mode, and `modelValue` initialises to `undefined`. So
**Reka calls the key resolver with a phantom `{}` on every render**.
`resolveItemIdentity`'s first statement is `if (itemId) return
itemId(item)` — unguarded — so a perfectly ordinary
`:item-id="(i) => i.id.toString()"` throws `TypeError` at mount. A
sentinel on the *return* doesn't help: the consumer's function has
already run.

`buildTreeIndex` therefore populates a `WeakMap<object, string>`
(`TreeIndex.refKeys`, item reference → key) while walking the tree. The
Reka-facing resolver reads that map and never reaches the consumer's
resolver:

```ts
const rekaGetKey = (item: unknown): string => {
    if (!isObject(item)) return EMPTY_KEY;
    return index.value.refKeys.get(item) ?? EMPTY_KEY;
};
```

Net effect: the consumer's `itemId` / `itemKey` runs **exactly once per
real item**, at index-build time, including when no selection is bound.

### `:expanded` is always bound (the `passive` trap)

`TreeRoot` evaluates `useVModel(props, 'expanded', emits, { passive:
(props.expanded === undefined) })` **once at setup**. If any render path
omits `:expanded`, Reka silently flips to internal state and vuecs's
expansion stops affecting the flatten — no error, no type failure.

`<VCTree>` therefore **unconditionally** passes `:expanded`, falling
back to its own `expandedInternal` ref (seeded from `:default-expanded`)
when the consumer binds nothing.

### Cascade kernel (pure, whole-tree, idempotent)

`utils/cascade.ts` is Vue-free: `normalize(index, selected)` walks
`index.order` **backwards** (pre-order reversed == post-order) and
derives every ancestor's state from its children in one pass;
`cascadeSelect(index, current, key, on)` does the explicit down-walk and
then calls `normalize`. The up-walk and the indeterminate set are
implicit.

Both upstream defects are **structural** properties here, not avoided
code paths:

| Reka defect | Why it's unreachable |
|---|---|
| `propagateSelect`'s descendant walk recurses on a hard-coded `item.children`, ignoring `getChildren` | The kernel walks `childKeys`, built by `buildTreeIndex` from the injected resolver. The literal `children` appears nowhere in it. |
| `handleBubbleSelect` resolves parents out of the *visible* flattened list, so a collapsed parent never updates | `normalize` iterates the **whole** index; `expanded` is not an input to it at all. |

**Idempotence** (`normalize(normalize(x)) === normalize(x)`) is what
lets one function serve three callers: a click, a lazy-load reconcile,
and an `:items` replacement. It also means a consumer-seeded
non-normalised value (a restored deep link) is corrected on render
rather than rendering a parent unchecked under fully-checked children.

One `cascade` boolean replaces Reka's asymmetric
`propagateSelect` / `bubbleSelect` pair. It requires `multiple`;
`checkboxMode = cascade && multiple` flips the row between the APG
*tree* pattern (`aria-selected`, binary) and *tree with checkboxes*
(`aria-checked`, which can be `"mixed"`).

`getChildren` never reads `.children` directly — `Item` is unconstrained
per the generic-component convention and `tsconfig.build.json` is
`strict: true`, so the fallback narrows through `isObject()` (never an
inline `typeof` check).

### Indentation via `--vc-tree-level`

Rows are a **flat** list (Reka flattens the visible tree into siblings),
so depth has to be painted rather than inherited from DOM nesting. Each
`<li>` carries `--vc-tree-level` inline; `packages/tree/assets/index.css`
does:

```css
.vc-tree { --vc-tree-indent: 1rem; }
.vc-tree-item { padding-inline-start: calc(var(--vc-tree-indent) * (var(--vc-tree-level, 1) - 1)); }
```

This works with **no theme installed**, keeps `TreeVirtualizer`
theoretically on the table, and means a theme overrides **one token**
rather than writing a rule per level — a theme must not re-implement
per-level padding. The recursive nested-`<ul>` alternative was rejected:
it gets indentation free from DOM nesting but would need vuecs to emit
`role="group"` itself and forecloses virtualization permanently.

The chevron is **drawn in CSS**, not iconised — a tree must render
correctly with no icon preset installed, and unlike a checkbox glyph the
chevron is pure affordance (the row's `aria-expanded` carries the
meaning). Consumers who want a real icon use the `#toggle` slot.
`<VCTreeItemTrigger>` is deliberately decorative (`aria-hidden`, not
focusable): per the APG the `treeitem` row itself is the control.

### Theme keys

| Key | Slots |
|---|---|
| `tree` | `root`, `empty` |
| `treeItem` | `root`, `content`, `trigger`, `triggerIcon`, `icon`, `label` |

Two keys, not the five a per-part split would give — one multi-slot key
costs 2 audit rows across 3 themes instead of 5.
`<VCTreeItemTrigger>` resolves against the same `treeItem` key (reading
`.trigger` / `.triggerIcon`), so it adds no audit row.

**The audit catalogs are an enforced gate.** `unknownElements` is not in
`AUDIT_SKIP`, so the moment any theme declares `tree` / `treeItem`, all
three `themes/*/test/unit/audit.spec.ts` need the
`import { treeThemeDefaults, treeItemThemeDefaults } from '@vuecs/tree'`
line plus both catalog rows, or the other two themes' specs fail.
`redundantStructural` is enforced too — a theme slot whose string equals
the structural default fails, so themes pass a different class, an
`extend(...)`, or `''`.

Tailwind carries row state inline via `aria-[…]:` / `data-[…]:`
variants and needs no bridge CSS. Bootstrap and Bulma gap-fill
`[data-selected]`, `[data-indeterminate]`, `[aria-busy]` and
`[aria-disabled]` in their `assets/index.css`, as usual for
attribute-selector state.

**All three themes key selection off `[data-selected]`, never
`[aria-selected]`.** The row swaps to `aria-checked="true|false|mixed"`
under `:cascade` and drops `aria-selected` entirely, so a rule keyed on
`aria-selected` would go dark exactly when cascade is on.
`data-selected` is emitted in both modes.

State attributes a theme can key off, on the `<li>`:
`aria-selected="true|false"` (plain mode), `aria-checked="true|false|mixed"`
(cascade mode), `data-selected`, `data-indeterminate`, `aria-expanded`,
`data-expanded`, `aria-busy="true"` (children loading),
`aria-disabled="true"`, `data-disabled`, `data-indent="N"`. On the
trigger: `data-state="open|closed"`, `data-loading`.

### Known limits (documented, not papered over)

| Limit | Why |
|---|---|
| Shift+**Arrow** range-select absent | Already dead upstream — Reka's `firstValue` is only assigned in `onSelectItem`'s `'replace'` branch, unreachable under the default `selectionBehavior: 'toggle'`. Shift+**click** works. |
| Typeahead buffer pollution | Inherited and unfixable from outside: `TreeRoot.handleKeydown` feeds *every* `event.key` into `refAutoReset('', 1000)` with no modifier/arrow filtering, so ArrowDown appends the literal `'ArrowDown'`. |
| `loop: false`, no `*` expand-all | Inherited. Reka never forwards `loop` to `RovingFocusGroup` and doesn't implement `*`. |
| No virtualization | `TreeVirtualizer` flips `isVirtual` and reroutes keydown; the `visibleKeys` / range assumptions don't survive it. |
| Filtered `:items` + cascade is wrong | A parent whose non-matching children were filtered out has all *remaining* children selected → gets promoted, emitting a key the user never clicked. `:items` must be the **full** tree. |
| Disabled children excluded from the parent gate | A branch whose only unselected child is disabled reports fully selected. The alternative — an unreachable child holding its parent permanently indeterminate — is worse; the user can't resolve it. |
| Stale keys never evicted | Preserving unresolved keys is required for deep-link/lazy, but a key whose item was genuinely deleted stays in the v-model forever. No rule distinguishes "not loaded yet" from "gone". |
| `buildTreeIndex` depth cap | The duplicate-key guard catches a cycle that reuses keys; one minting fresh keys needs the explicit cap (default 100) + dev-warn. |
| One `as Record<string, any>` per Reka boundary | Reka's `TreeItemProps<T>` is constrained `T extends Record<string, any>`; our unconstrained `Item` (required by #1601) doesn't satisfy it. Contained to two call sites behind one typed local. |

Out of scope for v1: virtualization, drag-and-drop reorder, tree
filtering/search.
