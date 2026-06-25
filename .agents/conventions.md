# Conventions

## Commit Messages

Enforced by **commitlint** (via Husky `commit-msg` hook) using `@tada5hi/commitlint-config`. Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

# Examples:
feat(navigation): add keyboard navigation support
fix(form-controls): correct checkbox toggle state
chore(deps): bump rollup to v4.58
```

## Linting

- **ESLint** (flat config) with `@tada5hi/eslint-config`
- Lints `packages/` and `examples/` directories (`.ts` and `.vue` files)
- Vue-specific rules enabled via `eslint-plugin-vue`
- **`npm run lint` must always pass with zero errors.** Warnings (e.g. `no-console`) are acceptable for intentional dev diagnostics but errors are not.
- Generated/build output directories (`**/dist/**`, `.nx/cache/**`, `examples/nuxt/.nuxt/**`, `examples/nuxt/.output/**`) are ignored via `eslint.config.js`

```bash
npm run lint          # Check — must exit with 0 errors
npm run lint:fix      # Auto-fix style issues
```

## TypeScript

- **Target**: ESNext
- **Module**: ESNext with Node module resolution
- Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- Strict mode is not enabled at root level
- Type declarations generated via `vue-tsc`

## Code Organization

- **`types.ts` files** contain only `type` and `interface` declarations — no `const`, `enum`, or runtime values
- **`constants.ts` files** contain `const`, `enum`, and other runtime value exports
- **Object type checks**: Always use the `isObject()` helper from `@vuecs/core/src/utils/object.ts`. Never use inline `typeof x === 'object' && x !== null` checks
- **Typed slot props**: Every component slot must have an exported slot-prop type (e.g. `ListItemSlotProps`, `NavItemLinkSlotProps`, `CountdownSlotProps`) wired into the component's `SlotsType<...>`. Render-function consumers rely on these exports for type safety (#1488). Use generics (`<T>`, `<META>`) for entity-typed props.
- **Slot-prop callbacks use the bare action name** — `remove`, `select`, `close`; never `onRemove` / `onSelect` / `onClose`. Slot props are a payload object, not Vue listeners (where the `onXxx` form is meaningful because Vue maps `@xxx` to `onXxx` internally), so they take the same naming style as Reka UI / Headless UI scoped slots. JSDoc the field as `Invoke to …` so the call signature reads obviously at the use site (`<template #remove="{ remove }">…@click="remove"`). When a slot exposes both data and a callback, name the type `<Component><Slot>SlotProps` and put the callback alongside the data fields (see `TagRemoveSlotProps` — `class` + `remove`).

## Wrapping Reka UI primitives — explicit-defaults convention

When a vuecs component (`<VC*>`) wraps a Reka primitive, **declare every
forwarded prop on the wrapper** with **concrete defaults that mirror
Reka's defaults** and **forward naturally** (no spread-guard):

```ts
const fooProps = {
    /** Preferred side of the trigger to render against. */
    side: { type: String as PropType<'top' | 'right' | 'bottom' | 'left'>, default: 'bottom' },
    /** Distance in pixels from the trigger. */
    sideOffset: { type: Number, default: 0 },

    /** Render inline instead of via portal (testing / custom mount points). */
    inline: { type: Boolean, default: false },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<...>, default: undefined },
};

setup(props, { attrs }) {
    return () => h(RekaPrimitive, mergeProps(attrs, {
        side: props.side,
        sideOffset: props.sideOffset,
    }));
}
```

**Rules:**

1. **Every prop gets a JSDoc one-liner** above its declaration — consumers
   read these in IDE autocomplete + generated `.d.ts`.
2. **Defaults are concrete and match Reka's `withDefaults(...)` value.**
   Look up the upstream default in
   `node_modules/reka-ui/src/<Family>/<Component>.vue` when wrapping a
   new primitive.
3. **Forward naturally:** `propX: props.propX`. No
   `...(props.X !== undefined ? { X: props.X } : {})` spread-guard.
4. For deliberate vuecs overrides of a Reka default, keep our value and
   add a `Vuecs convention:` note in the JSDoc explaining why.
5. Internal-only props (e.g. `inline` for portal opt-out, `themeClass`)
   keep their concrete defaults and still get JSDoc.
6. **`as:` / `tag:` render-target declarations widen to
   `[String, Object, Function]`:**
   ```ts
   as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
   ```
   The `[String, Object, Function]` runtime array accepts a tag name, a
   component options object (`RouterLink` / `NuxtLink`), AND a functional
   component (a plain function at runtime). Single-type `String` rejects
   component values at prop validation, silently coercing them to the
   default. Omitting `Function` lets the common object-component case
   through but emits a Vue prop-type warning when a *functional*
   component is passed — `Component` includes functional components, so
   the runtime constructor array must list `Function` to match the
   declared type (#1644). This diverges deliberately from upstream Reka's
   `Primitive` (which uses `[String, Object]`) — vuecs prefers
   warning-free functional-component support.

   **No cast is needed on the prop entry — but the declaration build must
   stay strict (#1649).** A polymorphic render-target prop that carries a
   Vue `default` becomes a key of the generated `DefineComponent`'s
   `Defaults` type parameter, and `vue-tsc` bakes that `Defaults` literal
   when emitting declarations. Under **`strict: false`** the bake is lossy
   — a string-literal default collapses `$props.as` to `string` (dropping
   the `Component` arm), breaking `<VCButton :as="RouterLink">` in a
   consumer's `vue-tsc` / `nuxi typecheck` build. Under **`strict: true`**
   (where `tsconfig.build.json` now sits — it inherits the base
   `@tada5hi/tsconfig` strictness the dev `tsconfig.json` already uses) the
   bake keeps the full union: `props.as` types as `string | Component`
   internally (the default applied) and `$props.as` as
   `string | Component | undefined` externally. So the plain `{ type, default }`
   pattern is correct *as long as the build stays strict* — do not flip
   `tsconfig.build.json` back to `strict: false`. (Applies only to
   render-target props — route props like `<VCLink>`'s `to`, typed
   `string | Record<string, any>`, stay `[String, Object]`.)

This convention applies to every Reka-wrapping component across
`@vuecs/overlays`, `@vuecs/forms`, `@vuecs/elements`, `@vuecs/navigation`
(stepper), and `@vuecs/pagination`. (Earlier docs proposed a
"lazy-forwarding" `default: undefined` + spread-guard pattern; that
approach was reverted because it hid the actual default from autocomplete
and led to subtle prop-shape drift.)

**Render target for unthemed generic elements:** when a vuecs component
needs Reka's `as` / `asChild` semantics but doesn't wrap a themed Reka
primitive (e.g. the Card compound bands), the inner render target is
**`VCPrimitive` from `@vuecs/core`**, NOT `Primitive` from `reka-ui`.
`VCPrimitive` is a line-for-line port of Reka's `Primitive` kept in
`@vuecs/core` so `@vuecs/core` (and any component that uses it) stays
free of a runtime `reka-ui` dep. See plan 034
([`.agents/plans/034-vc-primitive-wrapper.md`](plans/034-vc-primitive-wrapper.md)).
Themed Reka primitives (DialogContent, PopoverContent, StepperRoot,
…) keep importing from `reka-ui` directly — the wrap-in-VC contract
applies to the bare `Primitive` only.

## Generic-over-data components — `defineComponent` + cast (not `<script setup generic>`)

When a component needs to be **generic over a consumer-supplied entity
type** so slot props infer it (`<VCTable :data="users">` →
`#cell-name="{ row }"` types `row` as `User`), keep the runtime a plain
`defineComponent` render-function component (the SFC convention) and
**cast the default export** to a generic call/return signature
`vue-tsc` recognizes. Do **not** switch the component to `<script setup
generic="…">` — that's the only other path to generic slot inference,
but it conflicts with the `defineComponent` convention and forces a
`<template>` rewrite of render-function components.

The mechanism (introduced for `@vuecs/table`, issue #1601):

1. A reusable `GenericComponentShape<Props, Slots>` type encodes the
   exact call/return signature the Vue compiler emits for a
   `<script setup generic>` SFC — crucially, Volar reads the slot types
   off a `__ctx?` member on the **return type** (not the `ctx`
   parameter). It lives in `@vuecs/table/src/types.ts`.
2. Each component declares `Row`-substituted prop + slot shapes and a
   generic alias that wraps the helper:

   ```ts
   type VCTableComponent = <Row = Record<string, unknown>>(
       ...args: Parameters<GenericComponentShape<TablePropsGeneric<Row>, TableSlots<Row>>>
   ) => ReturnType<GenericComponentShape<TablePropsGeneric<Row>, TableSlots<Row>>>;

   const VCTable = defineComponent({ /* unchanged runtime */ });
   export default VCTable as unknown as VCTableComponent;
   ```

**Rules:**

- **`Row` stays unconstrained** (`<Row = Record<string, unknown>>`, no
  `extends`). A `Record<string, …>` constraint rejects `interface
  User {}` ("index signature is missing in type") — interfaces lack an
  implicit index signature. Matches every `<Row = unknown>` generic in
  the package's `types.ts`.
- **Splice emit handlers back into the generic props** as `on*` keys
  (`'onUpdate:sort'`, `onRowClick`). A cast-to-function component
  surfaces events through props, not a runtime `emits` option, so
  `v-model:*` / `@event` only type-check at the call site when the
  handler props are declared. **Watch the key casing** — Vue camelCases
  a kebab event name into its handler-prop key, so template
  `@row-click` resolves to `onRowClick`, NOT `onRow-click`. The
  `update:*` family is the exception: Vue does **not** camelCase the
  segment after the colon, so those stay hyphenated (`'onUpdate:sort'`).
  Getting the casing wrong fails silently — the listener falls back to
  implicit `any` and the build still compiles, so it must be caught by a
  call-site consumer check (below), not the declaration emit.
- **`attrs` / `emit` in the helper stay `unknown`** — they aren't
  inference channels (slots flow through `__ctx`), and `unknown` keeps
  it `no-explicit-any`-clean.
- **Registration needs a cast.** The generic-function type isn't
  structurally a Vue `Component`, so the `app.component(name, component
  as Component)` registration loop casts back (runtime is identical).
- **`h(Component, …)` / render-function usage needs a cast too.** The
  generic-function type isn't assignable to Vue's `Component` /
  `FunctionalComponent` parameter, so `h(VCTable, props)` doesn't
  type-check without `as Component`. This is inherent to *every* generic
  Vue component (a `<script setup generic>` SFC emits the same shape and
  has the same limitation) — it's the cost of being generic, not a
  defect of the cast. **Template usage** (the 99% path) is unaffected.

Verify end-to-end after any change — the declaration emit compiles the
typed surface even when it's subtly wrong, so build success is **not**
sufficient. `vue-tsc --declaration` must preserve the generic in the
emitted `.d.ts`, AND a consumer SFC compiling against the **built**
`dist` must: (a) infer `Row` in slot props (typed-field access OK,
wrong-type-field access errors); (b) infer `Row` in an **inline-arrow**
`@event` handler (a named, pre-annotated handler hides a broken
handler-prop key because `any` is assignable to it — use an inline
arrow or a wrong-type assertion to surface casing bugs).

## Theme bridge authoring — bridge what the framework exposes

When writing a theme-bridge CSS file (the `assets/index.css` in
`@vuecs/theme-bootstrap`, `@vuecs/theme-bulma`, or any future
`@vuecs/theme-<framework>`), follow this rule:

> **Bridge what the framework exposes; don't re-implement what it
> doesn't.**

A theme bridge layers onto the framework's *intended* theming API.
Bootstrap 5 exposes `--bs-btn-bg` etc. — the bridge maps those onto
`--vc-color-*`. Tailwind v4 exposes `@theme` color names — the
Tailwind theme writes utility class strings that resolve through
`--color-primary-*`. Both are within the framework's documented
contract.

Where a framework **doesn't** expose a hookable theming API for a
particular surface (Bulma 1.0's HSL-channel decomposition for
`.is-primary` button variants is the canonical example), accept that
the surface stays framework-default rather than copying the
framework's CSS into the bridge. **Document the limitation; don't
paper over it.**

### Why this matters

Crossing the line from "bridge" to "shadow stylesheet" produces:

- **Maintenance debt that scales with the framework.** Every BS / Bulma
  patch release becomes a manual diff against your bridge. The framework
  fixes a button hover regression; your bridge silently inherits the
  bug because it overrode the resolved property.
- **Visual drift on framework upgrades.** A 5.3 → 5.4 minor that
  changes default padding values cascades naturally if you bridge
  variables; it diverges silently if you reimplemented the rule.
- **Consumer surprise.** A consumer writes `.btn-primary { --bs-btn-bg:
  red }` expecting Bootstrap's documented contract to apply. If the
  bridge has overridden the resolved property directly, that escape
  hatch is broken.

### What the line looks like in practice

| Pattern | Bridge it | Don't reimplement it |
|---|---|---|
| Framework exposes `--bs-primary` / `--bulma-primary` | ✅ map to `--vc-color-primary-500` | |
| Framework exposes `--bs-btn-bg` / per-variant button vars | ✅ map per variant to `--vc-color-<scale>-600` | |
| Framework's `.bg-body` resolves through `--bs-body-bg-rgb` (no triplet bridge in pure CSS) | | ❌ don't override `body { background: ... }` directly — accept the limitation; document it; consumers that need it set a CSS var themselves (the `examples/bootstrap/` app does exactly this with `.vc-app-bar { background: var(--vc-color-bg) }`) |
| Bulma 1.0 routes `.button.is-primary` through `--bulma-button-h/s/l` channels | | ❌ don't redefine `.button.is-primary { background-color: ... }` — accept the limitation OR ship a runtime palette renderer (per plan 018) that writes the channels JS-side |
| Framework doesn't ship dark-mode for chrome under our `.dark` toggle | ⚠️ mirror the framework's own attribute (`data-bs-theme`, `data-theme`) at app level — the example apps' watchEffect mirror is the doctrinal pattern. (Plan 021 will move this into the theme itself.) | ❌ don't redeclare every navbar / form-control rule under `.dark` |

### Trade-off

Following this rule means some bridges look "incomplete" relative to
their framework's full feature set. That's correct. The bridge's job is
to make `--vc-color-*` reach as deep into the framework's tokens as the
framework permits — no further. Reimplementation is what theme
*packages* do (and own); a theme-bridge isn't a theme.

### When in doubt

If you're tempted to override a resolved property because the
framework "doesn't expose" the hook you want — first verify. Read the
framework's source for the rule you're targeting and confirm there's
truly no `var()`-aware token. If the only path is direct property
override, ship it as a documented limitation in the bridge file's
comment header (with the trade-off explained), not as a silent rule
that drifts on the next framework upgrade.

## Build

- **tsdown** for ESM-only bundling
- Each package has its own `tsdown.config.ts`
- Nx orchestrates builds with `^build` dependency ordering (dependencies build first)
- Build outputs are cached by Nx

## Releases

- **release-please** automates versioning, changelogs, and GitHub releases
- Triggered on push to `master` branch
- Each package is independently versioned (see `.release-please-manifest.json`)
- After release PR merge: builds, tests, and publishes all changed packages via `workspaces-publish`
- Tags follow pattern: `<component>-v<version>` (e.g., `core-v2.0.0`)

## CI/CD

Two workflows in `.github/workflows/`:

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `main.yml` | All branches + PRs | install, build, lint, tests |
| `release.yml` | Push to `master` | release-please, build, test, publish to npm |

## Documentation Updates

After any code changes that affect architecture, APIs, or behavior:

1. **`.agents/` docs** — Update `architecture.md`, `structure.md`, `testing.md`, or `conventions.md` if the change alters documented patterns, APIs, or resolution behavior
2. **Package `README.md`** — Update the relevant package's README if public API, usage examples, or behavior changed (READMEs are intentionally thin — most prose lives in the docs site)
3. **VitePress docs site (`docs/src/`)** — Update the relevant pages whenever code changes affect what consumers see or write:
   - `docs/src/components/<name>.md` for component API/prop/slot/event changes, plus the `<Demo>` block (and its corresponding demo file in `docs/src/.vitepress/theme/demos/`) when behavior visibly changes
   - `docs/src/getting-started/*.md` for installation, theming, or dark-mode changes
   - `docs/src/guide/*.md` for theme-system, variants, behavioral-defaults, design-tokens, or navigation-manager changes
   - `docs/src/themes/*.md` for theme-package changes (Tailwind, Bootstrap v4/v5, Font Awesome)
   - `docs/src/nuxt/*.md` for `@vuecs/nuxt` module or composable changes
   - `docs/src/.vitepress/config.mts` sidebar/nav when adding/removing/renaming components or sections
4. **`AGENTS.md`** — Update if the change affects package descriptions, dependency layers, or quick-reference commands

Do this as part of the same commit — documentation should never lag behind the code. The VitePress site is the user-facing reference; treating it as an afterthought breaks the "thin README → docs site" split that the package READMEs depend on.

## Demo authoring (docs/demos/src/)

VitePress pages embed iframe demos via two host components, picked by
intent:

- **`<Demo name="...">`** — passive showcase. Renders the iframe + the
  static code block from the markdown's `<template #code>` slot. No
  toolbar with controls; no `announceVariants` / `announceProps`
  round-trip. Use for components with no meaningful interactive axis
  (link, separator, countdown, gravatar, timeago, visually-hidden,
  aspect-ratio, form-pin, form-slider, form-select-search,
  modal-view-stack).
- **`<Playground name="...">`** — interactive sandbox. Same iframe +
  code block, plus a controls toolbar above the preview that the
  iframe drives via `announceVariants` / `announceProps`. Use whenever
  the demo announces a catalog.

Both share the same `iframe-bridge.ts` runtime; they only differ in
whether the parent renders the controls panel. Two announce APIs live
in `iframe-bridge.ts`:

- **`announceVariants(catalog, defaults)`** — convenience wrapper for
  enum-only variant axes. Catalog is `{ <key>: readonly string[] }`,
  defaults is `{ <key>: <value> }`. Updates flow into a flat
  `variantState` ref that the demo passes as
  `:theme-variant="variantState"`. Use this for size/density-only
  demos (the bulk of the form / overlay / list / stepper family).

- **`announceProps(catalog, defaults)`** — typed catalog supporting
  `boolean`, `enum`, `number`, `string` per prop. Catalog values can
  carry `section`, `min`/`max`/`step`, `options`, `placeholder`,
  `label`. Dot-pathed keys (`themeVariant.size`) auto-build nested
  objects on the iframe side, so a demo binds `v-bind="propState"` and
  every announced prop becomes interactive. Use this when the demo has
  multiple meaningful axes (e.g. `pagination` exposes `total` /
  `limit` / `busy` / `hideDisabled` / `themeVariant.{variant,size}`).

Both APIs are additive; pick whichever matches the demo's complexity.
The parent `Playground.vue` toolbar renders the matching control per
type: checkbox for boolean, `<select>` for enum, range+number for
number, text input for string. Sections (`section: 'Variant'`) group
related controls into a single labeled row.

## Adding a New Package

1. Create `packages/<name>/` with `src/index.ts`, `package.json`, `tsdown.config.ts`, `LICENSE` (Apache 2.0)
2. Follow the Vue plugin export pattern — install function calls `installThemeManager()` and registers components (see [architecture.md](architecture.md))
3. Add entry to `release-please-config.json` and `.release-please-manifest.json`
4. Add `@vuecs/core` as both `devDependencies` and `peerDependencies` if the package uses the theme system
5. Add a thin `README.md` (one paragraph + install snippet + link to the docs page)
6. **Add documentation to the VitePress site:**
   - One page in `docs/src/components/<name>.md` (or `docs/src/themes/<name>.md` for theme packages) with a `<Demo>` block + Vue/CSS code-group tabs
   - A demo SFC in `docs/src/.vitepress/theme/demos/<Name>.vue`
   - Sidebar entry in `docs/src/.vitepress/config.mts` (grouped by package)
   - Row in `docs/src/components/index.md` under the matching package section
   - If the package adds new exports, plugin install glue, or auto-imports — update `docs/src/.vitepress/theme/index.ts` so demos can use it
7. If the package ships its own CSS, add the `style` conditional export in `package.json` so consumers can use `@import "@vuecs/<name>"` (see [architecture.md → Short-form CSS imports](architecture.md))

## References
External project references live in .agents/references/. When looking up source code in a referenced project (e.g., tsoa), always update the corresponding reference file with:

The source file path / function name in the external project
The corresponding vuecs file path / function name
Any behavioral differences between the implementations
This builds a cumulative mapping over time so future work can quickly find corresponding code without re-searching.
