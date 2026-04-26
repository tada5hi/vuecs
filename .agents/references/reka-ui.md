# Reka UI Reference

**Reka UI** is an unstyled, headless Vue 3 primitive-component library — the rebrand of `radix-vue`, a Vue port of [Radix UI](https://www.radix-ui.com/). It ships ~50 composable, accessibility-first primitives that consumers style themselves. Reka UI is **the foundation Nuxt UI is built on** (every Nuxt UI overlay/menu/tabs/etc. is a thin styled wrapper around a Reka primitive).

For vuecs, Reka UI is **a building block, not a competitor**. The layer relationship is:

```
shadcn/ui  : Radix         ::  Nuxt UI : Reka UI  ::  vuecs : (currently nothing)
```

vuecs operates at Nuxt UI's layer (styled, theme-aware components). The natural lower layer for the overlay/menu/tooltip/popover surface vuecs is missing today is Reka UI.

## Version Snapshot (as of 2026-04-25)

| | Version | Date | Commit |
|---|---------|------|--------|
| **Latest stable** | v2.9.6 | 2026-04-13 | — |
| **Master HEAD** | — | 2026-04-25 | (active) |

- Repo: <https://github.com/unovue/reka-ui> (MIT, ~6.4k stars)
- Org: `unovue` (formerly `radix-vue`)
- Vue peer dep: `vue >= 3.4.0`
- Runtime deps: `@floating-ui/dom`, `@floating-ui/vue`, `@internationalized/date`, `@internationalized/number`, `@tanstack/vue-virtual`, `@vueuse/core`, `aria-hidden`, `defu`, `ohash`
- Build: ESM + CJS via tsdown, `sideEffects: false`, tree-shakeable. Per-component size budgets (e.g. AspectRatio ~5KB, Dialog ~25KB).
- Repo layout: pnpm monorepo. Single published package `packages/core/`, with subpath exports `./internal`, `./constant`, `./date`, `./namespaced`, `./nuxt`, `./resolver`.

## Category vs vuecs

| | Reka UI | vuecs |
|---|---|---|
| **Layer** | Headless primitives (logic + a11y, no styles) | Styled components (`vc-*` classes + theme system) |
| **Output** | Bare DOM with ARIA + `data-state="open"` etc. | Themed components driven by `ThemeManager` |
| **Vue API** | `.vue` SFCs, compound parts (`DialogRoot`, `DialogTrigger`, `DialogContent`) | Render functions (`defineComponent` + `h()`) |
| **Styling story** | None — accept `class`, expose `data-*` for selectors | Full system via `useComponentTheme` + variants/compoundVariants |
| **A11y** | First-class (focus trap, roving focus, aria-hidden, scroll lock) | Minimal — current vuecs surface is form/list/nav without complex orchestration |
| **Composition** | `asChild` + `Primitive` wrapper (slot-as-render) | Typed `SlotProps` exports (`ListItemSlotProps`, `NavItemLinkSlotProps`) |

## Components shipped

From `packages/core/src/`:

> Accordion, AlertDialog, AspectRatio, Autocomplete, Avatar, Calendar, Checkbox, Collapsible, Collection, ColorArea, ColorField, ColorPicker, ColorSlider, ColorSwatch, ColorSwatchPicker, Combobox, ConfigProvider, ContextMenu, DateField, DatePicker, DateRangeField, DateRangePicker, Dialog, DismissableLayer, DropdownMenu, Editable, FocusGuards, FocusScope, HoverCard, Label, Listbox, Menu, Menubar, MonthPicker, MonthRangePicker, NavigationMenu, NumberField, Pagination, PinInput, Popover, Popper, Presence, Primitive, Progress, RadioGroup, RangeCalendar, Rating, RovingFocus, ScrollArea, Select, Separator, Slider, Splitter, Stepper, Switch, Tabs, TagsInput, Teleport, TimeField, TimeRangeField, Toast, Toggle, ToggleGroup, Toolbar, Tooltip, Tree, Viewport, VisuallyHidden, YearPicker, YearRangePicker.

| Overlap with vuecs | vuecs has, Reka doesn't | Reka has, vuecs is missing |
|---|---|---|
| Pagination, Checkbox, Switch, RadioGroup, Select, Slider, NavigationMenu | Button, Countdown, Gravatar, Timeago, themed list controls | Dialog/AlertDialog, DropdownMenu/ContextMenu/Menubar, Tooltip/HoverCard, Popover, Tabs, Accordion, Combobox/Autocomplete, Toast, Calendar/DatePicker family, ColorPicker family, ScrollArea, Splitter, Stepper, Tree, Editable, NumberField, PinInput, TagsInput, Toolbar |

## Composables (from `packages/core/src/shared/`)

`useArrowNavigation, useBodyScrollLock, useDateFormatter, useDirection, useEmitAsProps, useFilter, useFocusGuards, useFormControl, useForwardExpose, useForwardProps, useForwardPropsEmits, useForwardRef, useGraceArea, useHideOthers, useId, useIsUsingKeyboard, useKbd, useLocale, useNonce, useSelectionBehavior, useSingleOrMultipleValue, useSize, useStateMachine, useTypeahead`

Utility components: `ConfigProvider`, `FocusScope`, `Presence`, `Primitive`, `RovingFocus`, `Slot`, `VisuallyHidden`.

## Concept / code mappings vs vuecs

| Reka UI | vuecs analog | Notes |
|---|---|---|
| `Primitive` + `asChild` / `as` | none — render functions emit a fixed root | Reka's `Primitive` would replace per-component `tag`/`is` props if adopted; large refactor |
| `ConfigProvider` (locale, dir, scrollBody, nonce) | `installThemeManager` + `installDefaultsManager` | Both Vue provide/inject; orthogonal — Reka covers locale/dir/portal config, vuecs covers class+behavior config |
| `data-state="open"` selector targeting | `themeVariant` prop + variant resolution | Different philosophies: Reka leaves DOM-level state, consumer writes selectors; vuecs computes class strings in JS. Compatible but can duplicate state if both run |
| `useForwardProps`, `useForwardPropsEmits` | none — vuecs wires this manually in render functions | Pure utilities; could be adopted standalone |
| `useArrowNavigation`, `RovingFocus`, `useTypeahead` | none in vuecs | `@vuecs/navigation` would directly benefit |
| `FocusScope`, `FocusGuards`, `useBodyScrollLock`, `useHideOthers` | none in vuecs | Required for any modal/drawer/popover work — non-trivial to re-implement |
| `Popper` (built on `@floating-ui/vue`) | none in vuecs | Required for tooltip/dropdown/popover |
| `Presence` (mount/unmount with transitions) | none | Useful for any animated overlay |

## How Nuxt UI consumes Reka UI (concrete pattern)

Nuxt UI components are thin SFC wrappers around Reka UI that add Tailwind variants via `tailwind-variants`. Confirmed in `nuxt/ui/src/runtime/components/`:

- **`Modal.vue`** — imports `DialogRoot, DialogContent, DialogTitle, VisuallyHidden` from `'reka-ui'`, extends `DialogRootProps`/`DialogRootEmits`, applies `tv({ extend: tv(theme) })` for classes, uses `useForwardPropsEmits` and `usePortal`.
- **`DropdownMenu.vue`** — imports `DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, ...` from `'reka-ui'`, layers tree-of-items props on top.
- Same 1:1 wrapping for Accordion, Calendar, Checkbox, Collapsible, ColorPicker, CommandPalette, ContextMenu, NavigationMenu, Popover, Slider, Switch, Tabs, Tooltip, etc.

**Nuxt UI ships zero behavior of its own for Modal/DropdownMenu/etc.** — pure styling + slot composition over Reka primitives.

## Lessons & principles for vuecs

Reka UI's design has several well-tested patterns worth absorbing into vuecs's architecture, regardless of whether we ever take a runtime dependency on it. These are upgrades to the principles already in `.agents/architecture.md`.

### 1. Compound-component pattern over monolithic props

Reka splits each component into named parts (`DialogRoot`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogClose`) that share state via context. vuecs today leans monolithic — e.g. `VCButton` accepts `iconLeft`/`iconRight`/`label` props instead of letting the consumer compose `<VCButton><VCButtonIcon /><VCButtonLabel>...</VCButtonLabel></VCButton>`. **For new composite components (especially overlays), prefer compound parts.** Each part gets its own `useComponentTheme` slot key, which slots cleanly into the existing `ThemeElements` augmentation.

### 2. `data-state` / `data-*` attributes as the styling contract

Reka exposes runtime state through DOM attributes (`data-state="open|closed"`, `data-disabled`, `data-orientation="horizontal"`, `data-side="top"`, `data-highlighted`). Consumers target these from CSS or Tailwind variants (`data-[state=open]:opacity-100`). This is **complementary** to vuecs's variant system — variants compute classes for *configured* state (size, color), `data-*` covers *runtime* state (open, hovered, focused, disabled). Adopting `data-*` for runtime state lets us:
- Stop re-rendering classes on every reactive flip (CSS handles it).
- Let theme packages write selector-based rules without needing a variant entry per state.
- Enable consumer overrides via Tailwind/CSS without going through `themeClass`.

Worth threading through the existing components opportunistically (e.g. `VCNavItem` could expose `data-active`, `data-collapsed`).

### 3. Headless composables as first-class API surface

Reka exports composables (`useArrowNavigation`, `useTypeahead`, `useFilter`, `useStateMachine`, `useSize`, `useDateFormatter`) independently of the components that use them. This makes the library a la carte. **vuecs should harden a `@vuecs/core` composables surface** — `useForwardProps`/`useForwardPropsEmits`-style helpers, plus dedicated a11y composables (arrow navigation for `VCNavItems`, typeahead for `VCFormSelect` once it gains search). Document them under `docs/src/guide/composables.md` so consumers can use them outside our components.

### 4. `asChild` / slot-as-element composition

Reka's `<Primitive as-child>` lets a primitive transfer its props/listeners to its first slotted child instead of rendering its own element. This is the inverse of vuecs's typed slot props but solves the same "let consumers control the DOM" problem. The closest current parallel in vuecs is the `tag`-prop pattern (where a few components accept the rendered tag). **Generalizing this into a `Primitive`-style render utility in `@vuecs/core/utils`** would let composites stay theme-aware while letting consumers swap the root element (e.g. render `VCNavItem` as a `<li>` vs `<a>` vs custom). Useful for SSR-friendly link interop with `@vuecs/link`.

### 5. State-machine composable

Reka's `useStateMachine` (a tiny finite-state-machine helper) drives every overlay open/close/transition lifecycle. vuecs has nothing for this. As soon as we ship animated mount/unmount (any overlay), we'll want either Reka's `Presence` + `useStateMachine` directly or our own equivalent. **Track this as a prerequisite for a future `@vuecs/overlays` package** — don't roll one ad-hoc per component.

### 6. `ConfigProvider` for cross-cutting concerns

Reka's `ConfigProvider` centralizes `dir` (LTR/RTL), `locale`, `useId` strategy, `scrollBody` lock target, and `nonce` (CSP). vuecs's `DefaultsManager` covers behavioral text and that's it. **RTL and locale propagation are gaps** — when we add overlays or date components, these become required. Extending `DefaultsManager` (or adding a sibling `ConfigManager`) to carry `dir`/`locale` keeps the install surface consistent: one `app.use(vuecs, { ... })` call configures everything.

### 7. Thin-wrapper philosophy validates our theme-package split

Nuxt UI's `Modal.vue` ≈ "import primitive + apply `tv()` + forward props." That's exactly the contract vuecs already assumes between components and theme packages — themes provide classes, components provide structure. **The distinction is that today vuecs components own *both* structure and a11y/state machinery, while Nuxt UI components only own structure** because Reka owns the rest. Splitting state machinery out (per items 3 + 5) gets us closer to the same lean shape without creating a hard dependency.

### 8. Per-component prop interfaces re-exported as types

Reka exports `DialogRootProps`, `DialogContentProps`, etc. as named types so wrappers can `extends` them. vuecs already exports SlotProps types (#1488) but doesn't always export the props interfaces in the same way. **Make `<Component>Props` a public export across all vuecs components** so wrapper components (in consumer codebases or in a future `@vuecs/*` higher-level package) can extend without prop drilling.

### 9. Separate "internal" subpath export

Reka exposes `reka-ui/internal` for advanced consumers. vuecs's packages export everything from a single `index.ts`. As `@vuecs/core` grows (theme + defaults + composables + utils), **consider a `./internal` subpath for low-level helpers** so the public surface stays curated and we keep room to refactor internals.

## Specific places Reka primitives could plug into vuecs today

1. **`@vuecs/navigation` keyboard a11y.** `RovingFocus`, `useArrowNavigation`, `useTypeahead` would replace any custom keyboard handling in `NavigationManager`/`VCNavItems`. Direct fit.
2. **A future `@vuecs/overlays` package** (Modal, Drawer, Popover, Tooltip, DropdownMenu) is the highest-value plug-in point — exactly what vuecs lacks today and exactly what Reka does best. Focus trap + scroll lock + portal + dismissable layer + floating-ui positioning all come for free.
3. **`@vuecs/form-controls`:** `Checkbox`, `Switch`, `RadioGroup`, `Slider`, `Select` from Reka could replace hand-rolled internals while keeping the existing `useComponentTheme`/`useComponentDefaults` outer shells. Risk: would need to map vuecs's `themeVariant`/`themeClass` model onto Reka parts (root vs trigger vs content vs indicator).
4. **`@vuecs/pagination`:** Reka ships `PaginationRoot/List/ListItem/First/Prev/Next/Last/Ellipsis`. Directly substitutable as the inner mechanic; vuecs could re-skin via the existing theme system. **Lowest-risk pilot.**
5. **Shared composables to adopt independently** (no full UI-lib dep): `useForwardProps`, `useForwardPropsEmits`, `useForwardExpose`, `useEmitAsProps`. Pure, would simplify any future composite components in `core`.

## Implementation pitfalls (learned during the pagination pilot)

These are gotchas that aren't obvious from Reka's API surface but bit us during Phase 1. Re-read this section before starting any new Reka wrapper.

### `as-child` + multi-child slot via `<template v-for>`

When wrapping a Reka primitive that renders an internal element you don't want in your DOM (e.g. `PaginationList` defaulting to `<div>`, `RovingFocusGroup` defaulting to `<div>`, etc.), pass `as-child` and let Reka's `Slot` component render N siblings directly under the parent's parent.

`Slot.ts` (in `reka-ui/dist/Primitive/Slot.js`) explicitly handles multi-child default slots:

```ts
const children = renderSlotFragments(slots.default());
const firstNonCommentChildrenIndex = children.findIndex((child) => child.type !== Comment);
// ... merges attrs into firstNonCommentChildren only ...
const cloned = cloneVNode({ ...firstNonCommentChildren, props: {} }, mergedProps);
if (children.length === 1) return cloned;
children[firstNonCommentChildrenIndex] = cloned;
return children;
```

So `<RekaPrimitive as-child v-slot="{ ... }">` with a `<template v-for>` body produces N siblings under the parent — no wrapper element. Discovered during pagination's `<ul> > <li>` layout: the default `<div>` from `PaginationList` broke the `:first-child`/`:last-child` CSS, and `as-child` solved it without needing `display: contents` or marker classes.

**When wrapping Reka primitives:** check if `as-child` solves a layout issue before reaching for CSS hacks.

### **Critical: uniform root vnode shape per v-for iteration**

Reka's `Slot` *mutates its rendered children array* — it replaces the first non-comment child with a `cloneVNode(..., mergedProps)`. If the first child's vnode lineage changes between renders (typically because of `v-if`/`v-else` at the wrapper level toggling between branches), Vue's reconciliation interacts badly with Slot's mutation and **leaks stale DOM from the previous branch**.

**Reproducible symptom from the pagination pilot:** jumping from page 1 to the last page rendered duplicates:

```
1, 9, 9, 9, …, 6, 7, 8, 9, 10
```

(Three stale "page 9" buttons before the ellipsis; the new sequence appended after.)

**Bad pattern (caused the bug):**

```vue
<RekaPrimitive as-child v-slot="{ items }">
    <template
        v-for="(item, idx) in items"
        :key="..."
    >
        <component
            :is="itemTag"
            v-if="item.type === 'page'"
            ...
        >
            <PaginationListItem ... />
        </component>
        <component
            :is="itemTag"
            v-else
            ...
        >
            <PaginationEllipsis ... />
        </component>
    </template>
</RekaPrimitive>
```

The wrapper component's vnode lineage differs between the `v-if` and `v-else` branches. Slot's clone of the first child gets confused when items shift and the first element's branch changes.

**Good pattern (fixes the bug):**

```vue
<RekaPrimitive as-child v-slot="{ items }">
    <component
        :is="itemTag"
        v-for="(item, idx) in items"
        :key="..."
        ...
    >
        <PaginationListItem v-if="item.type === 'page'" ... />
        <PaginationEllipsis v-else ... />
    </component>
</RekaPrimitive>
```

One uniform `<component :is="itemTag">` per iteration; the conditional content is *inside* the wrapper. Slot always sees the same first-child shape, Vue's diff is clean.

**Rule:** when using `as-child` on a Reka primitive that exposes a multi-item slot, every iteration of your `v-for` must produce the same root vnode type. Conditional rendering belongs *inside* the iteration's root, not at the iteration root level.

### Stable per-item keys for shifting windows

For pagination-style "windowed" lists where the visible items shift but the underlying values overlap (e.g. `[1,2,3,4,5,…,10]` → `[1,…,6,7,8,9,10]`), positional `:key="idx"` causes Vue to reuse DOM nodes between conceptually different items — you can briefly see the old number before the reactive update completes. Use **value-based keys** for items that have stable identity, fall back to positional keys only for items that don't:

```vue
:key="item.type === 'page' ? `p${item.value}` : `e${idx}`"
```

This pairs with the uniform-root-shape rule above — both are needed for clean reconciliation through Slot.

### Stale dist when iterating

Themes in vuecs are workspace packages. The docs site resolves them through `package.json` exports (`./dist/...`), not source. **After editing a theme, run `npm run build --workspace=packages/theme-<name>` before checking the docs site** — Vite/VitePress will use the rebuilt dist immediately, but won't recompile the dist itself. (`examples/nuxt` aliases directly to `src` so it sees changes without a rebuild — useful for fast iteration; the docs site is where stale-dist confusion shows up.)

### VitePress `button` reset vs Tailwind utilities

VitePress ships an unlayered reset:

```css
button { padding: 0; background-color: transparent; background-image: none; }
```

Per CSS Cascade Layers, **unlayered always wins over layered**, regardless of specificity. So Tailwind utilities like `bg-bg`, `hover:bg-bg-muted` (in `@layer utilities`) lose to this reset on every `<button>`. The active-page button in the pagination theme survives only because it uses `!`-prefixed utilities (`!bg-primary-600`).

**Don't fix this by adding `!` markers to the theme** — that taxes every consumer who customises via `extend('bg-red-500')` (they'd need to repeat the `!important` ceremony). Instead, fix it docs-locally with a targeted unlayered rule (see `docs/src/.vitepress/theme/style.css` for the precedent — there's already one for `vc-form-input` padding).

## Risks / tradeoffs of adopting Reka UI

- **New runtime dependency footprint.** `@floating-ui/dom`+`@floating-ui/vue`, `@internationalized/date`+`number`, `@tanstack/vue-virtual`, `@vueuse/core`, `aria-hidden`. Tree-shaking helps, but every overlay pulls floating-ui.
- **Framework-agnostic stance is unaffected for theme packages.** Reka has no theme contract — it just renders DOM with `data-state`. `@vuecs/theme-{bootstrap-v4,bootstrap-v5,font-awesome,tailwind}` continue as pure data.
- **API surface widens.** Each vuecs component would inherit Reka prop surfaces (`DialogRootProps` etc.) and the `asChild` mental model.
- **Render-function vs `.vue` mix.** vuecs avoids the template compiler in most packages, but `@vuecs/form-controls` already uses `.vue` SFCs — so importing Reka SFCs into render-function components is precedented (just means importing the compiled component, not the SFC).
- **SSR / Nuxt parity.** Reka supports SSR and ships a `./nuxt` subpath. `@vuecs/nuxt` would coexist cleanly.
- **Locale / direction overlap.** Reka's `ConfigProvider` overlaps with vuecs's `DefaultsManager` philosophically. Two providers to keep aligned (or merge — see lesson #6).
- **Versioning churn.** v2.9.x in active development. Some component families are still "Alpha" (date, color); Dialog/Popover/Menu are battle-tested via Nuxt UI.

## Bottom line

Reka UI is **the natural lower layer** for vuecs's missing overlay/menu/tabs/accordion/tooltip story. It is not redundant with what vuecs has; it is what vuecs would otherwise have to re-implement. Cleanest adoption path is incremental:

1. **Adopt the patterns first** (lessons #1–#9) — `data-*` state, compound components, headless composables, prop-type re-exports — without taking a runtime dep.
2. **Adopt the pure composables** (`useForward*`, `useArrowNavigation`, `useTypeahead`) into existing components.
3. **Build a new `@vuecs/overlays` package** on top of Reka UI's `Dialog`, `Popover`, `DropdownMenu`, `Tooltip`.
4. **Optionally** migrate `@vuecs/pagination` and `@vuecs/form-controls` internals to Reka parts behind the existing `useComponentTheme` API — keeping the public theme-system contract intact so theme packages don't break.

## Areas to Watch

When Reka UI ships major versions, review for:
- New primitives that close gaps in our roadmap (Tree, Splitter, Stepper, Toast)
- API changes to `Primitive` / `asChild` (the slot-as-element pattern is still evolving)
- `ConfigProvider` extensions (new locale/dir features) — useful for our own provider if we mirror this
- Composable additions (especially anything around virtualization, drag, or keyboard interaction)
- Vue version bumps — they tend to follow Vue's `useId`/`onWatcherCleanup` adoption fast
- Bundle-size shifts in the floating-ui / internationalized chains
