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

This convention applies to every Reka-wrapping component across
`@vuecs/overlays`, `@vuecs/forms`, `@vuecs/elements`, `@vuecs/navigation`
(stepper), and `@vuecs/pagination`. (Earlier docs proposed a
"lazy-forwarding" `default: undefined` + spread-guard pattern; that
approach was reverted because it hid the actual default from autocomplete
and led to subtle prop-shape drift.)

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
