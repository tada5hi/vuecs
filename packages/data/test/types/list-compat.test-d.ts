import { expectTypeOf, test } from 'vitest';
import type { ListMutators, ListPropsGeneric, ListState } from '@vuecs/list';
import type { DataCollection, DataRecord } from '../../dist';
import { defineDataCollection } from '../../dist';

// Structural drift guard for the `<VCList :state="source">` binding.
//
// `@vuecs/data` deliberately does NOT import `@vuecs/list` at runtime — a
// `DataCollection` is compatible with `ListState & ListMutators` by SHAPE,
// not by declaration. Nothing in either package's build can notice when
// that shape drifts apart (a renamed mutator, a dropped `apply*` helper, a
// `meta` bag that stops being a plain reactive object), so the two would
// silently stop composing and the failure would only surface in a
// consumer's template.
//
// These assertions import the BUILT `dist` declarations of both packages —
// the published surface is what consumers actually bind — and fail the
// build the moment the shapes diverge. `@vuecs/list` resolves through the
// workspace link to its `dist` (this package's `tsconfig.json` narrows the
// inherited `paths` map to `@vuecs/core` only, so no source alias applies).
//
// Run under a strictNullChecks-on tsconfig (`test/tsconfig.json`, wired via
// vitest.config.ts) so the assignments don't pass vacuously. Mirrors the
// facade drift guards in `@vuecs/list` / `@vuecs/table`.
//
// The barrel imports above double as the export-ability (TS4023) drift check —
// naming these types is exactly the condition a downstream declaration emit
// fails on — so do NOT relocate them to a deep path or drop them as "unused".

type Row = { id: number, name: string };
type Meta = { pagination: { limit: number, offset: number } };

declare const source : DataCollection<Row, Meta>;

test('DataCollection binds to <VCList :state>', () => {
    // The actual published binding surface — Meta pinned to
    // `Record<string, unknown>` and no mutators, exactly what <VCList :state>
    // receives. This is the assertion that literally pins the prop; the two
    // below pin the wider shape the mutator-driven call sites rely on.
    const bound : NonNullable<ListPropsGeneric<Row>['state']> = source;

    // The load-bearing guarantee: a DataCollection binds to <VCList :state>.
    const state : ListState<Row, Meta> & ListMutators<Row> = source;

    // @ts-expect-error — a mismatched item type must NOT be assignable.
    const wrong : ListState<{ other: boolean }, Meta> & ListMutators<{ other: boolean }> = source;

    void [bound, state, wrong];
});

type Query = { search?: string };

declare const typed : DataCollection<Row, Meta, Query>;
declare const typedRecord : DataRecord<Row, Meta, number>;

test('a typed-input source stays assignable to its default-input form', () => {
    // `load` / `refresh` / `ensure` are declared with method syntax so they
    // are checked bivariantly in `Input`. As property arrows they would be
    // contravariant, and `DataCollection<Row, Meta>` (Input = unknown) would
    // reject every source whose loader declares a typed input.
    const widened : DataCollection<Row, Meta> = typed;
    const widenedRecord : DataRecord<Row, Meta> = typedRecord;
    const state : ListState<Row, Meta> & ListMutators<Row> = typed;

    void [widened, widenedRecord, state];
});

test('the loader input type is inferred from the definition', () => {
    const source = defineDataCollection({
        load: async (_meta: Meta, query?: Query) => ({ data: [] as Row[], total: query ? 0 : 1 }),
        autoLoad: false,
    });

    expectTypeOf(source).toEqualTypeOf<DataCollection<Row, Meta, Query>>();
    expectTypeOf(source.load).parameter(1).toEqualTypeOf<Query | undefined>();
});
