import { assertType, expectTypeOf, test } from 'vitest';
import VCList from '../../dist/components/list/List.vue';
import VCListItem from '../../dist/components/list-item/ListItem.vue';
import type {
    ListItemProps,
    ListProps,
    ListState,
    SelectionKey,
} from '../../dist';

// Drift guard for the generic-over-`Item` facade (#1660).
//
// `<VCList>` / `<VCListItem>` stay plain `defineComponent`s at runtime; the
// generic is a hand-written cast (`export default … as unknown as
// VCListComponent`). That cast deliberately ERASES structural agreement
// between the runtime component and the facade, so the build stays green
// even if the facade silently stops threading `Item` — e.g. a mis-cased
// handler-prop key (`onUpdate-selection` instead of `onUpdate:selection`),
// a stale `Omit<ListProps, 'state' | 'data'>` key after a prop rename, or a
// slot left un-parameterized. None of those reproduce when type-checking the
// source `.vue`; they only manifest in the EMITTED declarations. So this
// guard imports from `dist` (built by `build:types`, which the package's
// `test` script runs first) and pins the inference end-to-end.
//
// Run under a strictNullChecks-on tsconfig (`test/tsconfig.json`, wired via
// vitest.config.ts) so the `toEqualTypeOf` assertions don't pass vacuously.
// Mirrors `packages/table/test/types/generic-row.test-d.ts` (#1601).

interface User {
    id: number;
    name: string;
    email: string;
}

// Instantiation expressions (TS 4.7+): erase to the plain component value at
// runtime, but pin `Item = User` at the type level so the facade's prop /
// slot shapes can be extracted. Volar threads slot types through the `__ctx`
// member on the return type (the same shape vue-tsc emits for `<script setup
// generic>`), so the slot map is read from there.
const itemOfUser = VCListItem<User>;
type ItemUserProps = Parameters<typeof itemOfUser>[0];
type ItemUserSlots = NonNullable<ReturnType<typeof itemOfUser>['__ctx']>['slots'];

const listOfUser = VCList<User>;
type ListUserProps = Parameters<typeof listOfUser>[0];

test('VCListItem threads Item into its default slot props', () => {
    // The facade resolves to a real typed callable (not `any` / an object).
    expectTypeOf(itemOfUser).not.toBeAny();
    // `#default` → { data: Item } (this is the exact regression #1660 fixes —
    // it used to resolve to `unknown` and need an `as` cast).
    expectTypeOf<Parameters<NonNullable<ItemUserSlots['default']>>[0]['data']>().toEqualTypeOf<User>();
    // not collapsed to `any` (which would make every assertion vacuous)
    expectTypeOf<Parameters<NonNullable<ItemUserSlots['default']>>[0]['data']>().not.toBeAny();
    // `:data` prop is Item-typed
    expectTypeOf<NonNullable<ItemUserProps['data']>>().toEqualTypeOf<User>();
});

test('VCList threads Item into its data / state props + selection handler', () => {
    expectTypeOf(listOfUser).not.toBeAny();
    // `:data` convenience prop is Item[]-typed
    expectTypeOf<NonNullable<ListUserProps['data']>>().toEqualTypeOf<User[]>();
    // `:state` prop threads Item into the underlying ListState
    expectTypeOf<NonNullable<ListUserProps['state']>>().toEqualTypeOf<ListState<User>>();
    // `update:selection` handler-prop key must be correctly cased AND present.
    // A hyphenated `onUpdate-selection` would leave this `undefined` and the
    // build would still pass without this assertion.
    expectTypeOf<NonNullable<ListUserProps['onUpdate:selection']>>()
        .parameter(0).toEqualTypeOf<SelectionKey[] | SelectionKey | null>();
});

test('Omit key lists stay anchored to the real prop types (rename guard)', () => {
    // The facades strip these keys by name then re-add them Item-typed.
    // `Omit<T, K>` does NOT require `K extends keyof T`, so renaming one of
    // these props without updating the Omit list would silently drop Item
    // inference from that axis. These assertions fail the build if a key
    // goes stale.
    type ItemKeysValid = 'data' extends keyof ListItemProps ? true : never;
    type ListKeysValid = ('state' | 'data') extends keyof ListProps ? true : never;
    assertType<ItemKeysValid>(true);
    assertType<ListKeysValid>(true);
});
