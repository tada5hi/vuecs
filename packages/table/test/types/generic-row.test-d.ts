import { assertType, expectTypeOf, test } from 'vitest';
import VCTable from '../../dist/components/Table.vue';
import VCTableLite from '../../dist/components/TableLite.vue';
import type {
    TableColumn,
    TableLiteProps,
    TableProps,
    TableSortState,
} from '../../dist';

// Drift guard for the generic-over-`Row` facade (#1601).
//
// `<VCTable>` / `<VCTableLite>` stay plain `defineComponent`s at runtime; the
// generic is a hand-written cast (`export default … as unknown as
// VCTableComponent`). That cast deliberately ERASES structural agreement
// between the runtime component and the facade, so the build stays green even
// if the facade silently stops threading `Row` — e.g. a mis-cased handler-prop
// key (`onRow-click` instead of `onRowClick`, the exact bug fixed mid-#1601), a
// stale `Omit<TableProps, 'data' | …>` key after a prop rename, or a slot left
// un-parameterized. None of those reproduce when type-checking the source
// `.vue`; they only manifest in the EMITTED declarations. So this guard imports
// from `dist` (built by `build:types`, which the package's `test` script runs
// first) and pins the inference end-to-end.
//
// Run under a strictNullChecks-on tsconfig (`test/tsconfig.json`, wired via
// vitest.config.ts) so the `toEqualTypeOf` assertions don't pass vacuously.

interface User {
    id: number;
    name: string;
    email: string;
}

// Instantiation expressions (TS 4.7+): erase to the plain component value at
// runtime, but pin `Row = User` at the type level so the facade's prop / slot
// shapes can be extracted. Volar threads slot types through the `__ctx` member
// on the return type (the same shape vue-tsc emits for `<script setup
// generic>`), so the slot map is read from there.
const tableOfUser = VCTable<User>;
type TableUserProps = Parameters<typeof tableOfUser>[0];
type TableUserSlots = NonNullable<ReturnType<typeof tableOfUser>['__ctx']>['slots'];

const liteOfUser = VCTableLite<User>;
type LiteUserProps = Parameters<typeof liteOfUser>[0];
type LiteUserSlots = NonNullable<ReturnType<typeof liteOfUser>['__ctx']>['slots'];

test('VCTable threads Row into slot props', () => {
    // The facade resolves to a real typed callable (not `any` / an object).
    expectTypeOf(tableOfUser).not.toBeAny();
    // `#cell-<key>` → { row: Row }
    expectTypeOf<Parameters<TableUserSlots[`cell-${string}`]>[0]['row']>().toEqualTypeOf<User>();
    // not collapsed to `any` (which would make every assertion vacuous)
    expectTypeOf<Parameters<TableUserSlots[`cell-${string}`]>[0]['row']>().not.toBeAny();
    // `#header-<key>` → { column: TableColumn<Row> }
    expectTypeOf<Parameters<TableUserSlots[`header-${string}`]>[0]['column']>()
        .toEqualTypeOf<TableColumn<User>>();
    // `#default` → { data: Row[] } (NOT `{ rows }` — guards the doc/shape regression)
    expectTypeOf<Parameters<NonNullable<TableUserSlots['default']>>[0]['data']>().toEqualTypeOf<User[]>();
    // `#expansion` → { row: Row } (VCTable-only)
    expectTypeOf<Parameters<NonNullable<TableUserSlots['expansion']>>[0]['row']>().toEqualTypeOf<User>();
});

test('VCTable threads Row into props + event handlers', () => {
    expectTypeOf<NonNullable<TableUserProps['data']>>().toEqualTypeOf<User[]>();
    // getRowKey row is typed
    expectTypeOf<NonNullable<TableUserProps['getRowKey']>>().parameter(0).toEqualTypeOf<User>();
    // @row-click handler-prop key must be camelCased (`onRowClick`) AND thread Row.
    // A hyphenated `onRow-click` would leave this `undefined` and the build would
    // still pass without this assertion — that was the live bug during #1601.
    expectTypeOf<NonNullable<TableUserProps['onRowClick']>>().parameter(0).toEqualTypeOf<User>();
    expectTypeOf<NonNullable<TableUserProps['onRowClick']>>().parameter(1).toEqualTypeOf<number>();
    // v-model event payloads match the runtime emit(...) signatures.
    expectTypeOf<NonNullable<TableUserProps['onUpdate:sort']>>().parameter(0).toEqualTypeOf<TableSortState>();
    expectTypeOf<TableUserProps>().toHaveProperty('onUpdate:selection');
    expectTypeOf<TableUserProps>().toHaveProperty('onUpdate:expanded');
});

test('VCTableLite threads Row into its (smaller) slot surface', () => {
    expectTypeOf(liteOfUser).not.toBeAny();
    expectTypeOf<Parameters<LiteUserSlots[`cell-${string}`]>[0]['row']>().toEqualTypeOf<User>();
    expectTypeOf<Parameters<NonNullable<LiteUserSlots['default']>>[0]['data']>().toEqualTypeOf<User[]>();
    expectTypeOf<NonNullable<LiteUserProps['data']>>().toEqualTypeOf<User[]>();
});

test('VCTableLite has no VCTable-only surface (expansion / row-click / getRowKey)', () => {
    expectTypeOf<LiteUserSlots>().not.toHaveProperty('expansion');
    expectTypeOf<LiteUserProps>().not.toHaveProperty('onRowClick');
    expectTypeOf<LiteUserProps>().not.toHaveProperty('getRowKey');
});

test('Omit key lists stay anchored to the real prop types (rename guard)', () => {
    // `TablePropsGeneric` strips these keys by name then re-adds them Row-typed.
    // `Omit<T, K>` does NOT require `K extends keyof T`, so renaming one of these
    // props without updating the Omit list would silently drop Row inference from
    // that axis. These assertions fail the build if a key goes stale.
    type TableRowKeysValid = ('data' | 'columns' | 'getRowKey') extends keyof TableProps ? true : never;
    type LiteRowKeysValid = ('data' | 'columns') extends keyof TableLiteProps ? true : never;
    assertType<TableRowKeysValid>(true);
    assertType<LiteRowKeysValid>(true);
});
