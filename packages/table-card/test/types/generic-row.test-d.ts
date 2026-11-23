import { assertType, expectTypeOf, test } from 'vitest';
import type { PaginationMeta } from '@vuecs/pagination';
import type {
    RowSelectionKey,
    TableColumn,
    TablePropsGeneric,
    TableSortState,
} from '@vuecs/table';
import type VCTableCard from '../../dist/components/TableCard.vue';
import type {
    TableCardNoResultsSlotProps,
    TableCardProps,
    TableCardPropsGeneric,
    TableCardSlots,
    VCTableCardComponent,
} from '../../dist';

// Drift guard for the generic-over-`Row` facade. `<VCTableCard>` is a plain
// `defineComponent` at runtime; the generic is a hand-written cast, so only
// the EMITTED declarations show whether `Row` still threads through props,
// forwarded table slots and handler props. Imports `dist` (built by
// `build:types`, which the package's `test` script runs first) and runs under
// strictNullChecks (`test/tsconfig.json`).

// eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
interface User {
    id: number;
    name: string;
}

declare const cardOfUser: typeof VCTableCard<User>;
type CardUserProps = Parameters<typeof cardOfUser>[0];
type CardUserSlots = NonNullable<ReturnType<typeof cardOfUser>['__ctx']>['slots'];

test('VCTableCard threads Row into the forwarded table slots', () => {
    expectTypeOf(cardOfUser).not.toBeAny();
    expectTypeOf<Parameters<CardUserSlots[`cell-${string}`]>[0]['row']>().toEqualTypeOf<User>();
    expectTypeOf<Parameters<CardUserSlots[`cell-${string}`]>[0]['row']>().not.toBeAny();
    expectTypeOf<Parameters<CardUserSlots[`header-${string}`]>[0]['column']>()
        .toEqualTypeOf<TableColumn<User>>();
    expectTypeOf<Parameters<NonNullable<CardUserSlots['noResults']>>[0]>()
        .toEqualTypeOf<TableCardNoResultsSlotProps>();
    expectTypeOf<CardUserSlots>().toHaveProperty('actions');
    expectTypeOf<CardUserSlots>().toHaveProperty('aside');
    expectTypeOf<CardUserSlots>().toHaveProperty('empty');
});

test('a wrong row field is rejected', () => {
    type CellRow = Parameters<CardUserSlots[`cell-${string}`]>[0]['row'];
    const row = {} as CellRow;

    // @ts-expect-error — `email` is not a `User` field.
    void row.email;
    void row.name;
});

test('VCTableCard threads Row into props + typed handler props', () => {
    expectTypeOf<NonNullable<CardUserProps['data']>>().toEqualTypeOf<User[]>();
    // Handler-prop keys must match Vue's emit -> prop mapping:
    // `update:*` keeps its hyphen-less colon form, `page` -> `onPage`.
    expectTypeOf<NonNullable<CardUserProps['onUpdate:search']>>().parameter(0).toEqualTypeOf<string>();
    expectTypeOf<NonNullable<CardUserProps['onUpdate:sort']>>().parameter(0).toEqualTypeOf<TableSortState>();
    expectTypeOf<NonNullable<CardUserProps['onPage']>>().parameter(0).toEqualTypeOf<PaginationMeta>();
    expectTypeOf<NonNullable<CardUserProps['onReset']>>().toEqualTypeOf<() => void>();

    // Inline-arrow handlers infer their parameter from the facade (a broken
    // key would leave them implicitly `any`).
    const props: CardUserProps = {
        data: [{ id: 1, name: 'Alice' }],
        onPage: (meta) => expectTypeOf(meta.offset).toEqualTypeOf<number>(),
        'onUpdate:sort': (sort) => expectTypeOf(sort).toEqualTypeOf<TableSortState>(),
        // Forwarded to <VCTable>: `@row-click` -> `onRowClick` (camelCased).
        onRowClick: (row, index) => {
            expectTypeOf(row).toEqualTypeOf<User>();
            expectTypeOf(index).toEqualTypeOf<number>();
        },
        getRowKey: (row) => row.id,
    };

    void props;
});

test('VCTableCard forwards the table selection + expansion handler props', () => {
    type TableUserProps = TablePropsGeneric<User>;

    // Same handler types as <VCTable> — derived, not re-declared.
    expectTypeOf<NonNullable<CardUserProps['onUpdate:selection']>>()
        .toEqualTypeOf<NonNullable<TableUserProps['onUpdate:selection']>>();
    expectTypeOf<NonNullable<CardUserProps['onUpdate:expanded']>>()
        .toEqualTypeOf<NonNullable<TableUserProps['onUpdate:expanded']>>();

    // A typed props object may set them (excess-property check passes) and
    // inline arrows infer their parameter.
    const props: CardUserProps = {
        'onUpdate:selection': (value) => expectTypeOf(value).not.toBeAny(),
        'onUpdate:expanded': (value) => {
            expectTypeOf(value).toEqualTypeOf<RowSelectionKey | RowSelectionKey[] | null>();
        },
    };

    void props;
});

test('a wrong row field in the forwarded row-click handler is rejected', () => {
    const props: CardUserProps = {
        // @ts-expect-error — `email` is not a `User` field.
        onRowClick: (row) => row.email,
    };

    void props;
});

test('Omit key list stays anchored to the real prop type (rename guard)', () => {
    type RowKeysValid = ('data' | 'columns') extends keyof TableCardProps ? true : never;
    assertType<RowKeysValid>(true);
});

test('the generic facade types stay nameable by consumers (#1704)', () => {
    // TS4023 guard: imported from the barrel on purpose — export-ability is
    // the condition a consumer's declaration emit checks. Do not drop.
    expectTypeOf<VCTableCardComponent>().not.toBeAny();
    expectTypeOf<TableCardSlots<User>>().not.toBeAny();
    expectTypeOf<TableCardPropsGeneric<User>>().not.toBeAny();
    expectTypeOf<VCTableCardComponent>().toEqualTypeOf<typeof VCTableCard>();
    expectTypeOf<NonNullable<TableCardPropsGeneric<User>['data']>>().toEqualTypeOf<User[]>();
});
