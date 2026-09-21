<script lang="ts">
import {
    computed,
    defineComponent,
    h,
    ref,
    shallowRef,
    watch,
} from 'vue';
import type {
    Component,
    ExtractPublicPropTypes,
    PropType,
    PublicProps,
    SlotsType,
    VNodeArrayChildren,
    VNodeChild,
} from 'vue';
import { TreeRoot } from 'reka-ui';
import {
    isObject,
    resolveItemIdentity,
    themableProps,
    useComponentTheme,
    useSelectionMachine,
} from '@vuecs/core';
import type {
    CollectionItemIdFn,
    CollectionItemKey,
    GenericComponentShape,
    SelectionKey,
    SelectionMode,
    ThemeClassesOverride,
    VariantValues,
} from '@vuecs/core';
import { provideTreeContext } from '../composables/context';
import type { TreeSelectOptions } from '../composables/context';
import { treeItemThemeDefaults, treeThemeDefaults } from '../theme';
import type { TreeItemThemeClasses, TreeThemeClasses } from '../types';
import {
    buildTreeIndex,
    cascadeSelect,
    normalize,
    orderKeys,
    resolveGuideRails,
} from '../utils';
import type { TreeIndex } from '../utils';
import VCTreeItem from './TreeItem.vue';
import VCTreeItemTrigger from './TreeItemTrigger.vue';

/**
 * Key handed to reka for an object it minted itself. reka computes
 * `selectedKeys` as `[getKey(modelValue ?? {})]` in single-select mode, so it
 * calls the resolver with a phantom `{}` on every render.
 */
const EMPTY_KEY = '\u0000vc-tree-none';

/**
 * Marks "this branch has children we haven't fetched yet". An EMPTY array is
 * truthy to reka, so the row reports `hasChildren` and renders expandable;
 * `buildTreeIndex` records it as resolved-with-no-children, which the cascade
 * kernel skips.
 */
const UNLOADED: unknown[] = [];

export const treeProps = {
    /**
     * The **full** tree. Passing a filtered subset while `cascade` is on
     * produces wrong results — a parent whose non-matching children were
     * removed looks fully selected and gets promoted.
     */
    items: {
        type: Array as PropType<unknown[]>,
        default: () => [],
    },
    /** Resolve an item's key. Highest priority in the identity ladder. */
    itemId: {
        type: Function as PropType<CollectionItemIdFn<never>>,
        default: undefined,
    },
    /** Field (or resolver) holding an item's key. Falls back to `.id`. */
    itemKey: {
        type: [String, Function] as PropType<CollectionItemKey<never>>,
        default: undefined,
    },
    /** Resolve an item's children. Falls back to an `Array`-valued `.children`. */
    getChildren: {
        type: Function as PropType<(item: never) => unknown[] | undefined>,
        default: undefined,
    },
    /** Resolve an item's label for the default row rendering. Falls back to `.label`, then the key. */
    getLabel: {
        type: Function as PropType<(item: never) => string>,
        default: undefined,
    },
    /** Mark individual rows non-interactive. */
    itemDisabled: {
        type: Function as PropType<(item: never) => boolean>,
        default: undefined,
    },
    /** Selected key(s). Use `v-model:selection`. Keys, never item objects. */
    selection: {
        type: [String, Array] as PropType<string | string[] | null>,
        default: null,
    },
    /** Allow more than one row to be selected. */
    multiple: {
        type: Boolean,
        default: false,
    },
    /**
     * Selecting a branch selects its whole subtree, and a partially selected
     * branch reports `aria-checked="mixed"`. Requires `multiple`.
     *
     * Vuecs convention: replaces reka's `propagateSelect` / `bubbleSelect`
     * pair, which is asymmetric as an API and has two upstream defects (its
     * descendant walk hard-codes `.children`, and its ancestor walk only
     * reaches currently-visible parents).
     */
    cascade: {
        type: Boolean,
        default: false,
    },
    /** Expanded keys. Use `v-model:expanded`. */
    expanded: {
        type: Array as PropType<string[]>,
        default: undefined,
    },
    /** Keys expanded on first render when `expanded` is not bound. */
    defaultExpanded: {
        type: Array as PropType<string[]>,
        default: undefined,
    },
    /** Fetch a branch's children the first time it is expanded. */
    load: {
        type: Function as PropType<(item: never) => Promise<unknown[]>>,
        default: undefined,
    },
    /** Report that an item has children before they have been loaded. */
    hasChildren: {
        type: Function as PropType<(item: never) => boolean>,
        default: undefined,
    },
    /** Disable the whole tree. */
    disabled: {
        type: Boolean,
        default: false,
    },
    /** Guard against a cyclic `getChildren`. */
    maxDepth: {
        type: Number,
        default: undefined,
    },
    /**
     * Draw `|` / `+-` guide rails in the indent gutters, the way a file
     * explorer does. Off by default — it changes a row's inner DOM.
     */
    guides: {
        type: Boolean,
        default: false,
    },
    /** Render target for the tree container. */
    as: {
        type: [String, Object, Function] as PropType<string | Component>,
        default: 'ul',
    },
    /**
     * Theme-class overrides applied to every row.
     *
     * Rows are rendered by the driver, not by the consumer, so there is no
     * `<VCTreeItem>` call site to put `themeClass` on. This is that call site.
     */
    itemThemeClass: {
        type: Object as PropType<ThemeClassesOverride<TreeItemThemeClasses>>,
        default: undefined,
    },
    /**
     * Theme-variant values applied to every row — e.g.
     * `:item-theme-variant="{ size: 'sm' }"` for a compact tree. Without it a
     * theme's `treeItem` variant axes would only be reachable through
     * app-level `overrides`.
     */
    itemThemeVariant: {
        type: Object as PropType<VariantValues>,
        default: undefined,
    },
    ...themableProps<TreeThemeClasses>(),
};

export type TreeProps = ExtractPublicPropTypes<typeof treeProps>;

export type TreeItemSlotProps<Item> = {
    item: Item,
    itemKey: string,
    level: number,
    expanded: boolean,
    selected: boolean,
    indeterminate: boolean,
    loading: boolean,
    hasChildren: boolean,
    classes: TreeItemThemeClasses,
    /** Invoke to expand or collapse this row. */
    toggle: () => void,
    /** Invoke to select this row. */
    select: () => void
};

export type TreeToggleSlotProps = {
    itemKey: string,
    expanded: boolean,
    loading: boolean,
    /** Invoke to expand or collapse the row. */
    toggle: () => void
};

// ──────────────────────────────────────────────────────────────────────────
// Generic-over-`Item` facade — see the note in `TreeItem.vue`. All three
// aliases are re-exported from the package barrel (#1704).
// ──────────────────────────────────────────────────────────────────────────

export interface TreeSlots<Item> {
    item?: (props: TreeItemSlotProps<Item>) => unknown;
    toggle?: (props: TreeToggleSlotProps) => unknown;
    empty?: () => unknown;
}

export type TreePropsGeneric<Item> = & Omit<
    TreeProps,
    'items' | 'itemId' | 'itemKey' | 'getChildren' | 'getLabel' | 'itemDisabled' | 'load' | 'hasChildren'
> &
{
    items?: Item[],
    itemId?: CollectionItemIdFn<Item>,
    itemKey?: CollectionItemKey<Item>,
    getChildren?: (item: Item) => Item[] | undefined,
    getLabel?: (item: Item) => string,
    itemDisabled?: (item: Item) => boolean,
    load?: (item: Item) => Promise<Item[]>,
    hasChildren?: (item: Item) => boolean,
    // Emit handler props. A cast-to-function component surfaces events through
    // `on*` PROPS, not a runtime `emits` option, so each key must be spelled
    // exactly as Vue derives it: `toHandlerKey(camelize(name))`. `camelize`
    // only rewrites `-x` sequences, so a KEBAB event name LOSES its hyphen
    // (`load-error` -> `onLoadError`) while the `update:*` family keeps its
    // colon (`update:selection` -> `onUpdate:selection`). Getting this wrong
    // fails SILENTLY — the listener degrades to implicit `any` and the build
    // still passes, so `test/types/generic-item.test-d.ts` pins every key.
    'onUpdate:selection'?: (value: string | string[] | null) => void,
    'onUpdate:expanded'?: (value: string[]) => void,
    'onSelect'?: (payload: { key: string, item: Item }) => void,
    'onLoadError'?: (payload: {
        key: string,
        item: Item,
        error: unknown
    }) => void
} &
PublicProps;

export type VCTreeComponent = <Item = Record<string, unknown>>(
    ...args: Parameters<GenericComponentShape<TreePropsGeneric<Item>, TreeSlots<Item>>>
) => ReturnType<GenericComponentShape<TreePropsGeneric<Item>, TreeSlots<Item>>>;

/**
 * `<VCTree>` — a tree view that **selects** rather than navigates.
 *
 * reka's `TreeRoot` is used as a focus/flatten shell only: it owns the
 * visible-row flatten, roving focus, typeahead and Left/Right navigation.
 * vuecs owns selection, expansion, the cascade and every painted attribute.
 * reka's own selection is never fed (`modelValue` is not passed, `select` and
 * `toggle` are always `preventDefault()`ed), which makes both of its cascade
 * defects unreachable rather than worked around.
 */
const VCTree = defineComponent({
    name: 'VCTree',
    props: treeProps,
    emits: [
        'update:selection',
        'update:expanded',
        'select',
        'load-error',
    ],
    slots: Object as SlotsType<TreeSlots<unknown>>,
    setup(props, { emit, slots }) {
        const theme = useComponentTheme('tree', props, treeThemeDefaults);
        // The driver's own copy of the row theme, resolved with the
        // driver-level row overrides so the trigger, the content wrapper and
        // the default label that `<VCTree>` renders itself carry the same
        // variant as the `<VCTreeItem>` around them. (`<VCTree>`'s own
        // `themeClass` targets the `tree` slot map, not this one.)
        const itemTheme = useComponentTheme(
            'treeItem',
            {
                get themeClass() {
                    return props.itemThemeClass;
                },
                get themeVariant() {
                    return props.itemThemeVariant;
                },
            },
            treeItemThemeDefaults,
        );

        // ── lazy children ────────────────────────────────────────────────
        // Kept in an overlay rather than written into `items`, so `:items`
        // stays a pure input the consumer still owns.
        const loaded = shallowRef(new Map<string, unknown[]>());
        const loading = ref(new Set<string>());

        const resolveKey = (item: unknown): string => {
            const id = resolveItemIdentity(
                item as never,
                props.itemId as CollectionItemIdFn<unknown> | undefined,
                props.itemKey as CollectionItemKey<unknown> | undefined,
            );

            return typeof id === 'undefined' ? EMPTY_KEY : String(id);
        };

        const fallbackChildren = (item: unknown): unknown[] | undefined => {
            if (!isObject(item)) {
                return undefined;
            }

            const record: { children?: unknown } = item;

            return Array.isArray(record.children) ? record.children : undefined;
        };

        const getChildrenResolved = (item: unknown): unknown[] | undefined => {
            const key = resolveKey(item);
            const own = loaded.value.get(key) ??
                (props.getChildren ? props.getChildren(item as never) : undefined) ??
                fallbackChildren(item);

            if (own) {
                // An EXPLICITLY empty array is a leaf, not an empty branch.
                // reka's `hasChildren` is a bare `!!getChildren(item)` and `[]`
                // is truthy, so returning it would paint a chevron and
                // `aria-expanded` on a row that can never have children — and
                // a lazy branch that loaded nothing would stay stuck open.
                return own.length > 0 ? own : undefined;
            }

            // Declared-but-unloaded: the empty sentinel is TRUTHY to reka, so
            // the row reports `hasChildren`, renders `aria-expanded` and
            // responds to ArrowRight before anything has been fetched. Gated
            // on `!loaded.has(key)` so the branch reverts to a leaf once a
            // fetch has returned nothing.
            if (props.load &&
                !loaded.value.has(key) &&
                props.hasChildren &&
                props.hasChildren(item as never)) {
                return UNLOADED;
            }

            return undefined;
        };

        const index = computed<TreeIndex<unknown>>(() => buildTreeIndex(
            props.items,
            resolveKey,
            getChildrenResolved,
            {
                isDisabled: (item) => (props.itemDisabled ? props.itemDisabled(item as never) : false),
                maxDepth: props.maxDepth,
            },
        ));

        /**
         * The resolver reka sees. It reads the index's reference map, so the
         * consumer's `itemId` / `itemKey` is only ever invoked on a real item
         * — reka hands this a phantom `{}` on every render in single mode,
         * and a resolver like `(i) => i.id.toString()` would throw on it.
         */
        const rekaGetKey = (item: unknown): string => {
            if (!isObject(item)) {
                return EMPTY_KEY;
            }

            return index.value.refKeys.get(item) ?? EMPTY_KEY;
        };

        // ── expansion ────────────────────────────────────────────────────
        // reka evaluates `passive: (props.expanded === undefined)` ONCE at
        // setup, so a render path that omits `:expanded` silently hands
        // expansion back to reka's internal state. We therefore ALWAYS bind
        // it, falling back to our own ref when the consumer doesn't.
        const expandedInternal = ref<string[]>([...(props.defaultExpanded ?? [])]);
        const expandedValue = computed<string[]>(() => props.expanded ?? expandedInternal.value);

        const setExpanded = (next: string[]) => {
            expandedInternal.value = next;
            emit('update:expanded', next);
        };

        const isExpanded = (key: string) => expandedValue.value.includes(key);

        // ── visible order ────────────────────────────────────────────────
        // Derived from our index rather than a second flatten of `items`, so
        // range-select and reka's rendered order cannot drift apart.
        const visibleKeys = computed<string[]>(() => {
            const current = index.value;
            const out: string[] = [];

            const walk = (keys: string[]) => {
                for (const key of keys) {
                    out.push(key);

                    if (isExpanded(key)) {
                        walk(current.nodes.get(key)?.childKeys ?? []);
                    }
                }
            };

            walk(current.rootKeys);

            return out;
        });

        // ── selection ────────────────────────────────────────────────────
        const selection = useSelectionMachine({
            mode: computed<SelectionMode | undefined>(() => (props.multiple ? 'multi' : 'single')),
            value: computed(() => props.selection ?? (props.multiple ? [] : null)),
            emit: (next) => emit('update:selection', next),
            keyAt: (position) => visibleKeys.value[position],
        });

        /** The keys the consumer bound, verbatim. */
        const boundSet = computed<Set<string>>(() => {
            const value = props.selection;

            if (Array.isArray(value)) {
                // `useSelectionMachine.setValue` normalises cross-mode misuse
                // on the WRITE path (single + array -> last element). The paint
                // path has to agree, or a single-select tree bound to an array
                // shows several selected rows that the next click silently
                // collapses to one.
                if (!props.multiple) {
                    const last = value[value.length - 1];

                    return new Set(typeof last === 'string' ? [last] : []);
                }

                return new Set(value);
            }

            return new Set(typeof value === 'string' ? [value] : []);
        });

        const cascading = computed(() => props.cascade && props.multiple);

        /**
         * The last selection a lazy-load reconcile emitted, held only until the
         * consumer's `v-model` flushes back. Lets concurrent reconciles compose
         * instead of clobbering each other; see `reconcileAfterLoad`.
         */
        const reconciled = shallowRef<Set<string> | null>(null);

        watch(() => props.selection, () => {
            reconciled.value = null;
        });

        /**
         * In a cascade tree a branch's state IS its children's state, so the
         * rendered set is derived rather than taken verbatim. Without this a
         * consumer seeding a non-normalised value — a restored `?path=` deep
         * link, say — would render a parent unchecked while every one of its
         * children is checked.
         *
         * `cascadeSelect()` always emits a normalised array, so this only
         * ever corrects consumer-seeded state, never our own writes.
         */
        const derived = computed(() => (cascading.value ?
            normalize(index.value, boundSet.value) :
            { selected: boundSet.value, indeterminate: new Set<string>() }));

        const selectedSet = computed<Set<string>>(() => derived.value.selected);
        const indeterminateSet = computed<Set<string>>(() => derived.value.indeterminate);

        const select = (key: string, options: TreeSelectOptions = {}) => {
            if (props.disabled) {
                return;
            }

            const node = index.value.nodes.get(key);

            // `<VCTreeItem>` already blocks reka's own select path for a
            // disabled row, but the `#item` slot hands consumers a `select()`
            // callback that reaches here directly. Gate it here too, so
            // `itemDisabled` means the same thing on both paths.
            if (node && node.disabled) {
                return;
            }

            emit('select', { key, item: node ? node.item : undefined });

            if (!cascading.value) {
                selection.toggle(key as SelectionKey, options);

                return;
            }

            const { selected } = cascadeSelect(
                index.value,
                selectedSet.value,
                key,
                !selectedSet.value.has(key),
            );

            selection.setValue(orderKeys(index.value, selected));
            // `setValue` re-anchors on the array tail, which is not where the
            // user clicked — put the anchor back so Shift+click spans right.
            selection.rangeAnchor.value = key;
        };

        const reconcileAfterLoad = (key: string) => {
            if (!cascading.value) {
                return;
            }

            // Read the BOUND value, not the derived one: the index has
            // already rebuilt with the new children, so `selectedSet` has
            // demoted the parent (its fresh children aren't selected yet).
            // The consumer's own value is what says the parent was selected.
            //
            // …except when a previous reconcile has emitted a value the parent
            // has not flushed back yet. Two branches whose fetches settle in
            // the SAME microtask batch would both read the pre-first-reconcile
            // prop, and the second emit would clobber the first — silently
            // dropping a branch the user never touched. `reconciled` is that
            // echo; the watcher below drops it as soon as the prop catches up.
            const next = new Set(reconciled.value ?? boundSet.value);

            // A selected parent adopts children that arrive later; a parent
            // whose children arrive unselected drops to indeterminate. Both
            // fall out of the idempotent kernel.
            if (next.has(key)) {
                const stack = [...(index.value.nodes.get(key)?.childKeys ?? [])];
                while (stack.length > 0) {
                    const childKey = stack.pop() as string;
                    const child = index.value.nodes.get(childKey);
                    if (child && !child.disabled) {
                        next.add(childKey);
                    }
                    for (const grandChild of child?.childKeys ?? []) {
                        stack.push(grandChild);
                    }
                }
            }

            const resolved = orderKeys(index.value, normalize(index.value, next).selected);

            // Only write when the reconcile actually changed something.
            // Expanding an unselected branch must not emit `update:selection`
            // — a consumer watching that channel would see a "change" that
            // carries the same keys it already holds.
            const current = orderKeys(index.value, boundSet.value);
            if (resolved.length === current.length &&
                resolved.every((entry, i) => entry === current[i])) {
                return;
            }

            reconciled.value = new Set(resolved);
            selection.setValue(resolved);
        };

        const toggle = (key: string) => {
            if (props.disabled) {
                return;
            }

            // A branch is expanded by click AND by ArrowRight, and a held key
            // repeats — so a slow fetch is easy to re-enter. Without this the
            // second call re-runs `load()` and appends the key to `expanded` a
            // second time, so the emitted array carries a duplicate.
            if (loading.value.has(key)) {
                return;
            }

            if (isExpanded(key)) {
                setExpanded(expandedValue.value.filter((entry) => entry !== key));

                return;
            }

            const node = index.value.nodes.get(key);
            const needsLoad = !!props.load &&
                !!node &&
                !loaded.value.has(key) &&
                !!props.hasChildren &&
                props.hasChildren(node.item as never);

            if (!needsLoad) {
                setExpanded([...expandedValue.value, key]);

                return;
            }

            loading.value = new Set(loading.value).add(key);

            void (props.load as (item: never) => Promise<unknown[]>)(node.item as never)
                .then((children) => {
                    loaded.value = new Map(loaded.value).set(key, children);
                    setExpanded([...expandedValue.value, key]);
                    reconcileAfterLoad(key);
                })
                .catch((error: unknown) => {
                    emit('load-error', {
                        key,
                        item: node.item,
                        error,
                    });
                })
                .finally(() => {
                    const next = new Set(loading.value);
                    next.delete(key);
                    loading.value = next;
                });
        };

        provideTreeContext({
            classes: itemTheme,
            checkboxMode: cascading,
            isSelected: (key) => selectedSet.value.has(key),
            isIndeterminate: (key) => indeterminateSet.value.has(key),
            isLoading: (key) => loading.value.has(key),
            select,
            toggle,
        });

        const resolveLabel = (item: unknown, key: string): string => {
            if (props.getLabel) {
                return props.getLabel(item as never);
            }

            if (isObject(item)) {
                const record: { label?: unknown } = item;
                if (typeof record.label === 'string') {
                    return record.label;
                }
            }

            return key;
        };

        const renderRow = (row: {
            _id: string,
            value: unknown,
            level: number,
            hasChildren: boolean,
            bind: Record<string, unknown>
        }): VNodeChild => {
            const key = row._id;
            const node = index.value.nodes.get(key);
            const toggleParams: TreeToggleSlotProps = {
                itemKey: key,
                expanded: isExpanded(key),
                loading: loading.value.has(key),
                toggle: () => toggle(key),
            };

            const itemParams: TreeItemSlotProps<unknown> = {
                item: row.value,
                itemKey: key,
                level: row.level,
                expanded: toggleParams.expanded,
                selected: selectedSet.value.has(key),
                indeterminate: indeterminateSet.value.has(key),
                loading: toggleParams.loading,
                hasChildren: row.hasChildren,
                classes: itemTheme.value,
                toggle: toggleParams.toggle,
                select: () => select(key),
            };

            const children: VNodeChild[] = [];

            if (props.guides) {
                // One span per gutter. `data-continues` keeps an ancestor's
                // vertical running past this row; the last gutter is the
                // row's own elbow. See `resolveGuideRails` for why this
                // cannot be a CSS-only effect.
                const rails = resolveGuideRails(index.value, key);
                rails.forEach((continues, position) => {
                    children.push(h('span', {
                        'class': itemTheme.value.rail,
                        'aria-hidden': 'true',
                        'data-vc-tree-rail': '',
                        'data-continues': continues ? '' : undefined,
                        'data-elbow': position === rails.length - 1 ? '' : undefined,
                    }));
                });
            }

            if (row.hasChildren) {
                children.push(slots.toggle ?
                    slots.toggle(toggleParams) as VNodeChild :
                    h(VCTreeItemTrigger, {
                        itemKey: key,
                        expanded: toggleParams.expanded,
                        loading: toggleParams.loading,
                    }));
            } else {
                // A leaf has no chevron, so without this it loses the whole
                // trigger column — which is WIDER than one indent step, so a
                // leaf would render visually to the LEFT of its own parent.
                // Purely structural: no theme slot, nothing to style.
                children.push(h('span', {
                    'class': 'vc-tree-item-spacer',
                    'aria-hidden': 'true',
                    'data-vc-tree-spacer': '',
                }));
            }

            children.push(slots.item ?
                slots.item(itemParams) as VNodeChild :
                h('span', { class: itemTheme.value.label }, resolveLabel(row.value, key)));

            return h(
                VCTreeItem as never,
                {
                    key,
                    'data': row.value,
                    'itemKey': key,
                    'level': row.level,
                    'disabled': props.disabled || !!node?.disabled,
                    'themeClass': props.itemThemeClass,
                    'themeVariant': props.itemThemeVariant,
                    'aria-setsize': row.bind['aria-setsize'],
                    'aria-posinset': row.bind['aria-posinset'],
                },
                { default: () => h('span', { class: itemTheme.value.content }, children) },
            );
        };

        return () => h(
            TreeRoot as never,
            {
                'as': props.as,
                'items': props.items,
                'getKey': rekaGetKey,
                'getChildren': getChildrenResolved,
                'expanded': expandedValue.value,
                'disabled': props.disabled,
                'class': theme.value.root,
                'data-guides': props.guides ? '' : undefined,
                // The ONE reka selection prop we do pass. It is not used for
                // selection — we never feed `modelValue` and always
                // `preventDefault()` — but `TreeRoot` derives
                // `aria-multiselectable` from it, and without it a multi-select
                // tree renders several `aria-selected="true"` rows inside a
                // tree that declares itself single-select. Setting the
                // attribute as a fallthrough attr does NOT work: `TreeRoot`
                // routes through `RovingFocusGroup`'s `as-child`, and `Slot`
                // merges child-last, so reka's own `undefined` wins.
                //
                // Bonus: with `multiple` truthy reka's `modelValue` defaults to
                // `[]`, so `selectedKeys` takes its `.map()` branch and never
                // constructs the phantom `{}` at all.
                'multiple': props.multiple,
            },
            {
                default: ({ flattenItems }: { flattenItems: Parameters<typeof renderRow>[0][] }) => {
                    if (flattenItems.length === 0) {
                        return slots.empty ?
                            // `role="none"`: a `role="tree"` owns only
                            // `treeitem` and `group` children, so a bare
                            // `<li>` would be an invalid child. Stripping its
                            // implicit `listitem` role keeps the empty state
                            // out of the tree's accessibility structure while
                            // leaving its content readable.
                            [h('li', { 'class': theme.value.empty, 'role': 'none' }, slots.empty() as VNodeArrayChildren)] :
                            [];
                    }

                    return flattenItems.map(renderRow);
                },
            },
        );
    },
});

export default VCTree as unknown as VCTreeComponent;
</script>
