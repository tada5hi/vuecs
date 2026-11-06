# Headless composables

Alongside `useComponentTheme` and `useComponentDefaults`, `@vuecs/core` exposes
a set of small, framework-friendly composables ported from Reka UI's shared
utilities. They live at the root export (no subpath) so consumers see one flat
import surface. Re-implemented in-tree rather than vendored so `@vuecs/core`
stays zero-dep beyond Vue 3.

| Composable | Purpose |
|---|---|
| `useForwardProps(props)` | `ComputedRef` of props with `undefined` keys dropped — for `v-bind`-ing onto an inner component without overriding its defaults |
| `useEmitAsProps(emit)` | Maps the wrapper's declared `emits` to `onEventName` handler props |
| `useForwardPropsEmits(props, emit?)` | `useForwardProps` + `useEmitAsProps` in one call |
| `useForwardExpose()` | Re-exposes the inner element/component on the wrapper's `expose`. Returns `{ forwardRef, currentRef, currentElement }` |
| `useArrowNavigation(event, current, parent, options?)` | Resolves the next focusable item for arrow / Home / End keys. Default attribute selector: `[data-vc-collection-item]` (vuecs-namespaced; Reka uses `[data-reka-collection-item]`) |
| `useTypeahead(callback?)` | Accumulates keystrokes for ~1 s and focuses the next item whose text starts with the buffer. Also exports `getNextMatch` and `wrapArray` for custom matching loops |
| `useId(deterministicId?, prefix?)` | Wraps Vue 3.5's native `useId()` with a default `vc-` prefix |
| `useStateMachine(initial, machine)` | Tiny state machine on top of `ref()`. Unknown events leave state unchanged. Used by `@vuecs/overlays` |
| `usePrimitiveElement()` | Resolves a template ref through `#text` / `#comment` $el nodes to the real DOM element. Pairs with `VCPrimitive`'s `asChild` template path. |

Source under `packages/core/src/utils/composables/`. Tests under
`packages/core/test/unit/composables/`. All eight composables ship in
`@vuecs/core`. `@vuecs/navigation` consumes `useArrowNavigation` in `VCNavItems`
to provide vertical arrow / Home / End keyboard navigation across
sibling items at any depth.

The same port-don't-depend pattern applies to the **`VCPrimitive`
component** — the generic `<as>` / `:as-child>` building block ported
from Reka into `@vuecs/core` under `packages/core/src/utils/primitive/`
(tests under `packages/core/test/unit/primitive/`). Unlike the
composables, `VCPrimitive` is a component (renders DOM) — it stays an
explicit import (`import { VCPrimitive } from '@vuecs/core'`) rather
than being registered globally as `<vc-primitive>` since the bare tag
has no meaning without an `as` / `asChild` prop. Used internally by
`@vuecs/elements`'s Card compound; exported for downstream component
libraries authoring their own themed elements.
