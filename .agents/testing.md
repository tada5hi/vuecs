# Testing

## Framework

- **Vitest** with the v8 coverage provider, `jsdom` environment for component specs.
- Each tested package/theme has its own `test/vitest.config.ts`.
- Two test flavours: runtime specs (`*.spec.ts`) and type-level drift guards (`*.test-d.ts`, run via Vitest `typecheck`).

## Test inventory

**14 workspaces** carry tests — **101 `.spec.ts`** total (plus 4 `.test-d.ts`
type guards). This is no longer "just core + navigation"; keep this table in
sync when adding a test dir.

| Workspace | Specs | Focus |
|-----------|------:|-------|
| `@vuecs/core` | 35 | Theme resolve/extend/variant/manager/composable/install, defaults, config, `defineTheme`/`mergeThemes`, `auditTheme`, ported composables (`useSelectionMachine`, primitive, …) |
| `@vuecs/table` | 16 | Sort machine, `sortRows`, selection machine, auto-render, driver/columns |
| `@vuecs/elements` | 10 | Card / Alert / Collapse / Badge / Avatar / Tag parts |
| `@vuecs/navigation` | 10 | Registry, resolver, breadcrumb, stepper |
| `@vuecs/overlays` | 10 | Modal / AlertDialog / Popover / Tooltip / menus, `useToast` / `useModal` / `useAlertDialog` |
| `@vuecs/design` | 7 | `useColorMode`, palette render/apply, standalone catalog |
| `@vuecs/forms` | 2 | Components (incl. Reka `VCFormSelect`), `useSubmitButton` |
| `@vuecs/list` | 2 | Components + list context |
| `@vuecs/locale` | 2 | `bindLocale` / `useLocaleManager` |
| `@vuecs/pagination` | 2 | Pagination behaviour |
| `@vuecs/placeholder` | 1 | Placeholder / wrapper |
| `@vuecs/theme-tailwind` | 2 | `auditTheme` drift + palette render |
| `@vuecs/theme-bootstrap` | 1 | `auditTheme` drift |
| `@vuecs/theme-bulma` | 1 | `auditTheme` drift |

## Running Tests

```bash
# All packages via Nx (cached) — this is what CI runs
npm run test                 # → npx nx run-many -t test

# Single package
npm run test --workspace=packages/table --if-present
```

> **Nx cache caveat.** `test` is cached by Nx (see `nx.json`). A green result
> may be a **cache hit** that never re-ran the specs — expected after a no-op
> change, misleading when you're chasing a flaky/env-dependent test. Force a
> real run with `npx nx run-many -t test --skip-nx-cache`, or clear everything
> with `npx nx reset`.

## Type-level tests (drift guards)

Four `*.test-d.ts` files assert that the **built `dist` declarations** keep
their generic-over-data / model-value inference. They run via each package's
Vitest `typecheck` block (its own `test/tsconfig.json`), not the runtime
`.spec.ts` path:

```
packages/table/test/types/generic-row.test-d.ts       # <VCTable> Row inference
packages/list/test/types/generic-item.test-d.ts        # <VCList>/<VCListItem> Item inference
packages/navigation/test/types/breadcrumb.test-d.ts    # <VCBreadcrumb> Item inference
packages/forms/test/types/model-value.test-d.ts        # form model-value typing
```

The generic-component pattern these guard is documented in
[Conventions → Generic-over-data components](conventions.md#generic-over-data-components--definecomponent--cast-not-script-setup-generic) —
don't re-document it here; add a `.test-d.ts` next to any new generic component.

## Component testing with Reka UI primitives (jsdom)

Overlay/select components that wrap Reka's open/close primitives (Select,
Dialog, Popover, Tooltip, DropdownMenu, ContextMenu) **do not open on
`wrapper.trigger('click')`** — Reka handles `pointerdown` and calls pointer-
capture APIs jsdom doesn't implement. Stub them, drive pointer events, and
tear down carefully:

```ts
beforeAll(() => {
    if (typeof Element !== 'undefined' && !Element.prototype.hasPointerCapture) {
        Element.prototype.hasPointerCapture = () => false;
        Element.prototype.setPointerCapture = () => {};
        Element.prototype.releasePointerCapture = () => {};
        Element.prototype.scrollIntoView = () => {};
    }
});
```

- **Open** the primitive by dispatching `pointerdown` + `pointerup` on the
  trigger (NOT `click`). Mount with `attachTo: document.body` so portalled
  content is queryable.
- **Pick an item** by dispatching real `PointerEvent('pointerdown')` +
  `PointerEvent('pointerup')` on it — a bare `new Event('pointerup')` is
  sometimes ignored by Reka's handler.
- **Tear down** with `wrapper.unmount()` + `await nextTick()` **before**
  clearing `document.body.innerHTML` — Reka schedules microtasks (e.g. close-
  on-pick) that `insertBefore` on the teleport target; clearing body first
  crashes the next render.

Reference implementation: `packages/forms/test/unit/components.spec.ts` (the
`VCFormSelect` block).

## Vitest Config

Each tested package has a `test/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx,js,jsx}'],
            thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
        },
    },
});
```

## CI

`main.yml`'s **Test Packages** job runs `npx nx run-many -t test` after the
build job — i.e. **every** package's test target across the Nx graph, not a
single-package matrix. Nx caching means unaffected packages replay from cache.
