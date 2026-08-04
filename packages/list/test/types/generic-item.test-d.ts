import { assertType, expectTypeOf, test } from 'vitest';
import VCList from '../../dist/components/list/List.vue';
import VCListItem from '../../dist/components/list-item/ListItem.vue';
import type {
    ListItemProps,
    ListItemPropsGeneric,
    ListItemSlots,
    ListProps,
    ListPropsGeneric,
    ListSlots,
    ListState,
    SelectionKey,
    VCListComponent,
    VCListItemComponent,
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

test('the generic facade types stay nameable by consumers (#1704)', () => {
    // TS4023 guard. A consumer that registers `<VCList>` / `<VCListItem>` in an
    // SFC and runs `vue-tsc --declaration` has to WRITE the component's type
    // into its own emitted `.d.ts`. Every type in that chain must therefore be
    // exported from the module that declares it — unexported `*Slots` /
    // `*PropsGeneric` / `VC*Component` aliases fail the CONSUMER build with:
    //
    //   TS4023: Exported variable '__VLS_export' has or is using name
    //   'ListSlots' ... but cannot be named.
    //
    // Nothing in vuecs's own build reproduces that (the names resolve fine
    // in-package), so these imports ARE the guard: `export`-ability is exactly
    // the condition TS4023 checks, and dropping any `export` breaks this file.
    // Imported from the top-level barrel (not the deep `.vue` path) so
    // consumers also get the short, stable name.
    expectTypeOf<VCListComponent>().not.toBeAny();
    expectTypeOf<VCListItemComponent>().not.toBeAny();
    expectTypeOf<ListSlots>().not.toBeAny();
    expectTypeOf<ListItemSlots<User>>().not.toBeAny();
    expectTypeOf<ListPropsGeneric<User>>().not.toBeAny();
    expectTypeOf<ListItemPropsGeneric<User>>().not.toBeAny();

    // The facade aliases are the same callables the default exports are cast to.
    expectTypeOf<VCListComponent>().toEqualTypeOf<typeof VCList>();
    expectTypeOf<VCListItemComponent>().toEqualTypeOf<typeof VCListItem>();
    // …and they really do thread `Item` (not a vacuous `any` passthrough).
    expectTypeOf<NonNullable<ListPropsGeneric<User>['data']>>().toEqualTypeOf<User[]>();
    expectTypeOf<NonNullable<ListItemPropsGeneric<User>['data']>>().toEqualTypeOf<User>();
    expectTypeOf<Parameters<NonNullable<ListItemSlots<User>['default']>>[0]['data']>()
        .toEqualTypeOf<User>();
});
