import { assertType, expectTypeOf, test } from 'vitest';
import VCTree from '../../dist/components/Tree.vue';
import VCTreeItem from '../../dist/components/TreeItem.vue';
import type {
    TreeItemPropsGeneric,
    TreeItemSlotProps,
    TreeItemSlots,
    TreeProps,
    TreePropsGeneric,
    TreeSlots,
    VCTreeComponent,
    VCTreeItemComponent,
} from '../../dist';

// Drift guard for the generic-over-`Item` facade (the #1601 / #1660 pattern).
//
// `<VCTree>` / `<VCTreeItem>` stay plain `defineComponent`s at runtime; the
// generic is a hand-written cast (`export default … as unknown as
// VCTreeComponent`). That cast deliberately ERASES structural agreement
// between the runtime component and the facade, so the build stays green even
// if the facade silently stops threading `Item` — a mis-cased handler-prop key
// (`onUpdateSelection` instead of `onUpdate:selection`), a stale `Omit<…>` key
// after a prop rename, or a slot left un-parameterized. None of those
// reproduce when type-checking the source `.vue`; they only manifest in the
// EMITTED declarations. So this guard imports from `dist` and pins the
// inference end to end.
//
// Run under a strictNullChecks-on tsconfig (`test/tsconfig.json`, wired via
// vitest.config.ts) so the assertions don't pass vacuously.

interface Folder {
    id: string;
    label: string;
    children?: Folder[];
}

// Instantiation expressions (TS 4.7+): erase to the plain component value at
// runtime, but pin `Item = Folder` at the type level. Volar threads slot types
// through the `__ctx` member on the RETURN type (the same shape vue-tsc emits
// for `<script setup generic>`).
const treeOfFolder = VCTree<Folder>;
type TreeFolderProps = Parameters<typeof treeOfFolder>[0];
type TreeFolderSlots = NonNullable<ReturnType<typeof treeOfFolder>['__ctx']>['slots'];

const itemOfFolder = VCTreeItem<Folder>;
type ItemFolderProps = Parameters<typeof itemOfFolder>[0];
type ItemFolderSlots = NonNullable<ReturnType<typeof itemOfFolder>['__ctx']>['slots'];

test('VCTree threads Item into its items prop and accessor props', () => {
    expectTypeOf(treeOfFolder).not.toBeAny();

    expectTypeOf<NonNullable<TreeFolderProps['items']>>().toEqualTypeOf<Folder[]>();
    expectTypeOf<NonNullable<TreeFolderProps['items']>>().not.toBeAny();

    // The accessor props take the consumer entity, not `unknown` — this is
    // what lets `:get-children="(f) => f.children"` type-check at the call
    // site without a cast.
    expectTypeOf<NonNullable<TreeFolderProps['getChildren']>>()
        .parameter(0).toEqualTypeOf<Folder>();
    expectTypeOf<NonNullable<TreeFolderProps['getLabel']>>()
        .parameter(0).toEqualTypeOf<Folder>();
    expectTypeOf<NonNullable<TreeFolderProps['itemDisabled']>>()
        .parameter(0).toEqualTypeOf<Folder>();
    expectTypeOf<NonNullable<TreeFolderProps['hasChildren']>>()
        .parameter(0).toEqualTypeOf<Folder>();
    expectTypeOf<NonNullable<TreeFolderProps['load']>>()
        .parameter(0).toEqualTypeOf<Folder>();
    expectTypeOf<NonNullable<TreeFolderProps['load']>>()
        .returns.toEqualTypeOf<Promise<Folder[]>>();
});

test('VCTree threads Item into its #item slot props', () => {
    expectTypeOf<Parameters<NonNullable<TreeFolderSlots['item']>>[0]['item']>()
        .toEqualTypeOf<Folder>();
    expectTypeOf<Parameters<NonNullable<TreeFolderSlots['item']>>[0]['item']>()
        .not.toBeAny();

    // The non-generic slot fields stay concrete.
    expectTypeOf<Parameters<NonNullable<TreeFolderSlots['item']>>[0]['level']>()
        .toEqualTypeOf<number>();
    expectTypeOf<Parameters<NonNullable<TreeFolderSlots['toggle']>>[0]['expanded']>()
        .toEqualTypeOf<boolean>();
});

test('VCTree declares correctly-cased emit handler props', () => {
    // A cast-to-function component surfaces events through `on*` PROPS, not a
    // runtime `emits` option, so `v-model:selection` / `@load-error` only
    // type-check at the call site when these keys exist and are spelled the
    // way Vue derives them. Vue does NOT camel-case the segment after the
    // colon, so `update:selection` stays hyphenated; a kebab event name like
    // `load-error` keeps its hyphen too. Getting either wrong fails SILENTLY
    // — the listener falls back to implicit `any`.
    expectTypeOf<NonNullable<TreeFolderProps['onUpdate:selection']>>()
        .parameter(0).toEqualTypeOf<string | string[] | null>();
    expectTypeOf<NonNullable<TreeFolderProps['onUpdate:expanded']>>()
        .parameter(0).toEqualTypeOf<string[]>();
    expectTypeOf<NonNullable<TreeFolderProps['onSelect']>>()
        .parameter(0).toEqualTypeOf<{ key: string, item: Folder }>();
    // `load-error` is a KEBAB event name, so Vue camelizes it: `onLoadError`.
    // Only the `update:*` family keeps its punctuation (camelize sees no
    // hyphen). Verified against Vue's own `toHandlerKey(camelize(name))`.
    expectTypeOf<NonNullable<TreeFolderProps['onLoadError']>>()
        .parameter(0).toEqualTypeOf<{
        key: string,
        item: Folder,
        error: unknown
    }>();
});

test('VCTreeItem threads Item into its data prop and default slot', () => {
    expectTypeOf(itemOfFolder).not.toBeAny();
    expectTypeOf<NonNullable<ItemFolderProps['data']>>().toEqualTypeOf<Folder>();
    expectTypeOf<Parameters<NonNullable<ItemFolderSlots['default']>>[0]['item']>()
        .toEqualTypeOf<Folder>();
    expectTypeOf<Parameters<NonNullable<ItemFolderSlots['default']>>[0]['item']>()
        .not.toBeAny();
});

test('Omit key lists stay anchored to the real prop types (rename guard)', () => {
    // The facades strip these keys by name and re-add them Item-typed.
    // `Omit<T, K>` does NOT require `K extends keyof T`, so renaming one of
    // these props without updating the Omit list would silently drop Item
    // inference from that axis with no build error.
    type TreeKeysValid = (
        'items' | 'itemId' | 'itemKey' | 'getChildren' | 'getLabel' | 'itemDisabled' | 'load' | 'hasChildren'
    ) extends keyof TreeProps ? true : never;
    assertType<TreeKeysValid>(true);
});

test('the generic facade types stay nameable by consumers (#1704)', () => {
    // TS4023 guard. A consumer that registers `<VCTree>` in an SFC and runs
    // `vue-tsc --declaration` has to WRITE the component's type into its own
    // emitted `.d.ts`. Every type in that chain must be exported from the
    // module that declares it — an unexported `interface` (which every
    // `*Slots` map is) fails the CONSUMER build with:
    //
    //   TS4023: Exported variable '__VLS_export' has or is using name
    //   'TreeSlots' ... but cannot be named.
    //
    // Nothing in vuecs's own build reproduces that, so these barrel imports
    // ARE the guard: `export`-ability is exactly what TS4023 checks.
    expectTypeOf<VCTreeComponent>().not.toBeAny();
    expectTypeOf<VCTreeItemComponent>().not.toBeAny();
    expectTypeOf<TreeSlots<Folder>>().not.toBeAny();
    expectTypeOf<TreeItemSlots<Folder>>().not.toBeAny();
    expectTypeOf<TreePropsGeneric<Folder>>().not.toBeAny();
    expectTypeOf<TreeItemPropsGeneric<Folder>>().not.toBeAny();
    expectTypeOf<TreeItemSlotProps<Folder>>().not.toBeAny();

    // The facade aliases are the same callables the default exports are cast to.
    expectTypeOf<VCTreeComponent>().toEqualTypeOf<typeof VCTree>();
    expectTypeOf<VCTreeItemComponent>().toEqualTypeOf<typeof VCTreeItem>();
    // …and they really do thread `Item`.
    expectTypeOf<NonNullable<TreePropsGeneric<Folder>['items']>>().toEqualTypeOf<Folder[]>();
    expectTypeOf<NonNullable<TreeItemPropsGeneric<Folder>['data']>>().toEqualTypeOf<Folder>();
});
