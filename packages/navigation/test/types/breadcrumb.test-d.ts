import { assertType, expectTypeOf, test } from 'vitest';
import VCBreadcrumb from '../../dist/components/breadcrumb/Breadcrumb.vue';
import type {
    BreadcrumbItem,
    BreadcrumbItemSlotProps,
    BreadcrumbListProps,
    BreadcrumbProps,
} from '../../dist';

// Drift guard for the generic-over-`Item` facade (#1659).
//
// `<VCBreadcrumb>` stays a plain `defineComponent` at runtime; the generic is
// a hand-written cast (`export default … as unknown as VCBreadcrumbComponent`).
// That cast deliberately ERASES structural agreement between the runtime
// component and the facade, so the build stays green even if the facade
// silently stops threading `Item` — e.g. a mis-cased handler-prop key
// (`onselect` instead of `onSelect`), a stale `Omit<BreadcrumbProps, 'items'>`
// key after a prop rename, or a slot left un-parameterized. None of those
// reproduce when type-checking the source `.vue`; they only manifest in the
// EMITTED declarations. So this guard imports from `dist` (built by
// `build:types`, which the package's `test` script runs first) and pins the
// inference end-to-end.
//
// Run under a strictNullChecks-on tsconfig (`test/tsconfig.json`, wired via
// vitest.config.ts) so the `toEqualTypeOf` assertions don't pass vacuously.
// Mirrors `packages/list/test/types/generic-item.test-d.ts` (#1660) and
// `packages/table/test/types/generic-row.test-d.ts` (#1601).

interface Crumb extends BreadcrumbItem {
    id: number;
}

// Instantiation expressions (TS 4.7+): erase to the plain component value at
// runtime, but pin `Item = Crumb` at the type level so the facade's prop /
// slot shapes can be extracted. Volar threads slot types through the `__ctx`
// member on the return type (the same shape vue-tsc emits for `<script setup
// generic>`), so the slot map is read from there.
const breadcrumbOfCrumb = VCBreadcrumb<Crumb>;
type BreadcrumbCrumbProps = Parameters<typeof breadcrumbOfCrumb>[0];
type BreadcrumbCrumbSlots = NonNullable<ReturnType<typeof breadcrumbOfCrumb>['__ctx']>['slots'];

test('VCBreadcrumb infers Item from :items', () => {
    // The facade resolves to a real typed callable (not `any` / an object).
    expectTypeOf(breadcrumbOfCrumb).not.toBeAny();
    // `:items` prop is Item[]-typed
    expectTypeOf<NonNullable<BreadcrumbCrumbProps['items']>>().toEqualTypeOf<Crumb[]>();
    expectTypeOf<NonNullable<BreadcrumbCrumbProps['items']>>().not.toBeAny();
});

test('VCBreadcrumb threads Item into its #item slot props', () => {
    type ItemSlotProps = Parameters<NonNullable<BreadcrumbCrumbSlots['item']>>[0];
    // `#item` → { item: Item; index; current } (this is the exact regression
    // #1659 fixes — `item` used to resolve to the base `BreadcrumbItem`).
    expectTypeOf<ItemSlotProps['item']>().toEqualTypeOf<Crumb>();
    // not collapsed to `any` (which would make every assertion vacuous)
    expectTypeOf<ItemSlotProps['item']>().not.toBeAny();

    // The richer field flows through.
    expectTypeOf<ItemSlotProps['item']['id']>().toEqualTypeOf<number>();
    // @ts-expect-error — `bogus` is not a key of Crumb.
    expectTypeOf<ItemSlotProps['item']['bogus']>();
});

test('VCBreadcrumb threads Item into its #item-label slot props', () => {
    type ItemLabelSlotProps = Parameters<NonNullable<BreadcrumbCrumbSlots['item-label']>>[0];
    expectTypeOf<ItemLabelSlotProps['item']>().toEqualTypeOf<Crumb>();
    expectTypeOf<ItemLabelSlotProps['item']>().not.toBeAny();
    expectTypeOf<ItemLabelSlotProps['item']['id']>().toEqualTypeOf<number>();
    // @ts-expect-error — `bogus` is not a key of Crumb.
    expectTypeOf<ItemLabelSlotProps['item']['bogus']>();
});

test('VCBreadcrumb infers Item into its select handler-prop', () => {
    // `select` handler-prop key must be correctly cased AND present. A
    // mis-cased `onselect` would leave this `undefined` and the build would
    // still pass without this assertion.
    expectTypeOf<NonNullable<BreadcrumbCrumbProps['onSelect']>>()
        .parameter(0).toEqualTypeOf<Crumb>();
    expectTypeOf<NonNullable<BreadcrumbCrumbProps['onSelect']>>()
        .parameter(1).toEqualTypeOf<number>();

    // Inline-arrow `@select` handler infers `(item: Crumb, index: number)`.
    // A named, pre-annotated handler would hide a broken handler-prop key
    // because `any` is assignable to it — use an inline arrow to surface it.
    const onSelect: NonNullable<BreadcrumbCrumbProps['onSelect']> = (item, index) => {
        expectTypeOf(item).toEqualTypeOf<Crumb>();
        expectTypeOf(item).not.toBeAny();
        expectTypeOf(index).toEqualTypeOf<number>();
        // The richer field is accessible on the inferred item.
        assertType<number>(item.id);
        // @ts-expect-error — `bogus` is not a key of Crumb.
        void item.bogus;
    };
    onSelect({ label: 'Home', id: 1 }, 0);
});

test('BreadcrumbItem and part prop types stay importable', () => {
    // Importing these from `../../dist` (the top-level barrel) is itself a
    // guard — `export * from './components'` must keep surfacing them.
    expectTypeOf<BreadcrumbItem['label']>().toEqualTypeOf<string>();
    expectTypeOf<BreadcrumbProps>().not.toBeAny();
    expectTypeOf<BreadcrumbItemSlotProps<Crumb>['item']>().toEqualTypeOf<Crumb>();
    expectTypeOf<BreadcrumbListProps>().not.toBeAny();
});
