<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type {
    GenericComponentShape,
    ThemeClassesOverride,
    UseComponentThemeProps,
    VariantValues,
} from '@vuecs/core';
import {
    computed,
    defineComponent,
    getCurrentInstance,
    h,
    mergeProps,
    onScopeDispose,
    ref,
    watch,
} from 'vue';
import type {
    Component,
    ExtractPublicPropTypes,
    PropType,
    PublicProps,
    VNodeChild,
} from 'vue';
import { provideBreadcrumbContext } from './context';
import { breadcrumbBehavioralDefaults } from './defaults';
import { renderBreadcrumbIcon } from './render-icon';
import { breadcrumbThemeDefaults } from './theme';
import { useBreadcrumbFromRegistry } from './use-breadcrumb-from-registry';
import { injectBreadcrumbLeafRegistry } from './use-breadcrumb-leaf';
import type { BreadcrumbItem, BreadcrumbThemeClasses } from './types';

import VCBreadcrumbList from './BreadcrumbList.vue';
import VCBreadcrumbItem from './BreadcrumbItem.vue';
import VCBreadcrumbLink from './BreadcrumbLink.vue';
import VCBreadcrumbPage from './BreadcrumbPage.vue';
import VCBreadcrumbSeparator from './BreadcrumbSeparator.vue';
import VCBreadcrumbEllipsis from './BreadcrumbEllipsis.vue';

const breadcrumbProps = {
    /**
     * Crumb data (driver mode). When omitted, the default slot is rendered
     * as a manual compound (`<VCBreadcrumbList>` etc. by hand).
     */
    items: { type: Array as PropType<BreadcrumbItem[]>, default: undefined },
    /**
     * Collapse the middle of the trail into a single `<VCBreadcrumbEllipsis>`
     * when the crumb count exceeds this. `undefined` (default) = never collapse.
     */
    maxItems: { type: Number, default: undefined },
    /** Crumbs to keep before the ellipsis when collapsing. */
    itemsBeforeCollapse: { type: Number, default: 1 },
    /** Crumbs to keep after the ellipsis when collapsing. */
    itemsAfterCollapse: { type: Number, default: 1 },
    /**
     * Derive crumbs from a published navigation's `activeTrail` by registry
     * id (see `<VCNavItems registry registry-id>`). Ignored when `:items` is
     * set. Auto-follows the route with zero per-page wiring.
     */
    registryId: { type: String, default: undefined },
    /**
     * Disambiguator for `useBreadcrumbLeaf('id')` when more than one
     * `<VCBreadcrumb>` is mounted. Omit for the nearest-ancestor default.
     */
    leafId: { type: String, default: undefined },
    /** Root landmark tag. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'nav' },
    /** Accessible name for the `<nav>` (overrides the `breadcrumb.label` default). */
    label: { type: String, default: undefined },
    /** Theme-class overrides for this component instance. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<BreadcrumbThemeClasses>>, default: undefined },
    /** Theme-variant values for this component instance. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type BreadcrumbProps = ExtractPublicPropTypes<typeof breadcrumbProps>;

/** Slot props for the driver's `#item` slot — generic over the consumer's item type. */
export type BreadcrumbItemSlotProps<Item extends BreadcrumbItem = BreadcrumbItem> = {
    item: Item;
    index: number;
    /** True for the current (last, or `item.current`) crumb. */
    current: boolean;
};

type SequenceEntry =    | {
    type: 'item'; 
    item: BreadcrumbItem; 
    index: number 
} |
    { type: 'ellipsis'; hidden: BreadcrumbItem[] };

function buildSequence(
    items: BreadcrumbItem[],
    maxItems: number | undefined,
    before: number,
    after: number,
): SequenceEntry[] {
    if (!maxItems || items.length <= maxItems || before + after >= items.length) {
        return items.map((item, index) => ({
            type: 'item', 
            item, 
            index, 
        }));
    }
    const head: SequenceEntry[] = items
        .slice(0, before)
        .map((item, index) => ({
            type: 'item', 
            item, 
            index, 
        }));
    const tailStart = items.length - after;
    const tail: SequenceEntry[] = items
        .slice(tailStart)
        .map((item, k) => ({
            type: 'item', 
            item, 
            index: tailStart + k, 
        }));
    return [...head, { type: 'ellipsis', hidden: items.slice(before, tailStart) }, ...tail];
}

const VCBreadcrumb = defineComponent({
    name: 'VCBreadcrumb',
    inheritAttrs: false,
    props: breadcrumbProps,
    emits: ['select'],
    setup(props, {
        attrs, 
        emit, 
        slots, 
    }) {
        const themeProps: UseComponentThemeProps<BreadcrumbThemeClasses> = {
            get themeClass() { return props.themeClass; },
            get themeVariant() { return props.themeVariant; },
        };
        const theme = useComponentTheme('breadcrumb', themeProps, breadcrumbThemeDefaults);
        const defaults = useComponentDefaults('breadcrumb', props, breadcrumbBehavioralDefaults);

        // The leaf-label override (dynamic `/:id` titles). `<VCBreadcrumb>`
        // owns its own `currentPath` so the override auto-clears on route
        // change. Soft `$route` read — no static `vue-router` import.
        const globals = getCurrentInstance()?.appContext.config.globalProperties;
        const currentPath = computed<string | undefined>(
            () => (globals?.$route as { path?: string } | undefined)?.path,
        );
        const leafOverride = ref<string | undefined>(undefined);
        watch(currentPath, () => { leafOverride.value = undefined; });
        const leafHandle = {
            set: (label: string) => { leafOverride.value = label; },
            clear: () => { leafOverride.value = undefined; },
        };

        // Propagate theme-variant (e.g. size) + the root theme-class to parts,
        // plus the nearest-ancestor leaf handle.
        provideBreadcrumbContext({
            themeClass: () => props.themeClass,
            themeVariant: () => props.themeVariant,
            leaf: leafHandle,
        });

        // `:leaf-id` registration (the two-breadcrumb disambiguator).
        if (props.leafId != null) {
            const registry = injectBreadcrumbLeafRegistry();
            if (registry) {
                const id = props.leafId;
                registry.set(id, leafHandle);
                onScopeDispose(() => {
                    if (registry.get(id) === leafHandle) {
                        registry.delete(id);
                    }
                });
            }
        }

        // Effective trail: explicit `:items` wins; else registry-derived
        // (`:registry-id`); else empty (manual-compound mode uses the slot).
        const registryItems = useBreadcrumbFromRegistry(() => props.registryId ?? '');
        const effectiveItems = computed<BreadcrumbItem[]>(() => {
            const base = props.items ?? (props.registryId != null ? registryItems.value : []);
            const override = leafOverride.value;
            if (override == null || base.length === 0) {
                return base;
            }
            const out = base.slice();
            out[out.length - 1] = { ...out[out.length - 1], label: override };
            return out;
        });

        const ariaLabel = computed(() => props.label ?? defaults.value.label);

        const renderLabel = (item: BreadcrumbItem, index: number): VNodeChild => {
            if (slots['item-label']) {
                return slots['item-label']({ item, index });
            }
            return item.label;
        };

        const renderCrumbContent = (item: BreadcrumbItem, index: number, current: boolean): VNodeChild => {
            if (slots.item) {
                return slots.item({
                    item, 
                    index, 
                    current, 
                });
            }
            return [
                item.icon ? renderBreadcrumbIcon(item.icon) : null,
                renderLabel(item, index),
            ];
        };

        const renderCrumb = (item: BreadcrumbItem, index: number): VNodeChild => {
            const items = effectiveItems.value;
            const current = item.current ?? (index === items.length - 1);
            const content = renderCrumbContent(item, index, current);

            if (item.disabled) {
                return h(VCBreadcrumbPage, { disabled: true }, { default: () => content });
            }
            if (item.to != null || item.href != null) {
                return h(
                    VCBreadcrumbLink,
                    {
                        to: item.to, 
                        href: item.href, 
                        active: current, 
                    },
                    { default: () => content },
                );
            }
            // url-less node: non-navigable text that can still drive `select`.
            return h(
                VCBreadcrumbPage,
                { current, onClick: () => emit('select', item, index) },
                { default: () => content },
            );
        };

        const renderSeparator = (): VNodeChild => h(
            VCBreadcrumbSeparator,
            null,
            slots.separator ? { default: () => slots.separator!() } : undefined,
        );

        const renderItems = (): VNodeChild[] => {
            const items = effectiveItems.value;
            const sequence = buildSequence(
                items,
                props.maxItems,
                props.itemsBeforeCollapse,
                props.itemsAfterCollapse,
            );
            const out: VNodeChild[] = [];
            sequence.forEach((entry, i) => {
                if (i > 0) {
                    out.push(renderSeparator());
                }
                if (entry.type === 'ellipsis') {
                    out.push(h(
                        VCBreadcrumbItem,
                        { key: 'ellipsis' },
                        {
                            default: () => h(
                                VCBreadcrumbEllipsis,
                                null,
                                slots.ellipsis ? { default: () => slots.ellipsis!({ hidden: entry.hidden }) } : undefined,
                            ),
                        },
                    ));
                    return;
                }
                out.push(h(
                    VCBreadcrumbItem,
                    { key: entry.index },
                    { default: () => renderCrumb(entry.item, entry.index) },
                ));
            });
            return out;
        };

        return () => {
            const navChildren = slots.default ?
                slots.default() :
                h(VCBreadcrumbList, null, { default: () => renderItems() });
            return h(
                props.as,
                mergeProps(attrs, {
                    'class': theme.value.root || undefined,
                    'aria-label': ariaLabel.value,
                }),
                navChildren,
            );
        };
    },
});

/**
 * `<VCBreadcrumb>`'s slot map, generic over the consumer's `Item` type so
 * the `#item` / `#item-label` slot props infer richer entities passed via
 * `:items`. `default` is the manual-compound escape hatch.
 */
interface BreadcrumbSlots<Item extends BreadcrumbItem = BreadcrumbItem> {
    default?: () => unknown;
    'item'?: (props: BreadcrumbItemSlotProps<Item>) => unknown;
    'item-label'?: (props: { item: Item; index: number }) => unknown;
    'separator'?: () => unknown;
    'ellipsis'?: (props: { hidden: Item[] }) => unknown;
}

/**
 * Public props with the `Item`-typed `items` arm and the `select` emit
 * handler spliced in. A cast-to-function component surfaces events through
 * `on*` props, so `@select` only type-checks at the call site when the
 * handler prop is declared here.
 */
type BreadcrumbPropsGeneric<Item extends BreadcrumbItem> = & Omit<BreadcrumbProps, 'items'> &
    {
        items?: Item[];
        onSelect?: (item: Item, index: number) => void;
    } &
    PublicProps;

/**
 * Generic `<VCBreadcrumb>` type. `Item` is constrained to `BreadcrumbItem`
 * (a named object type, not a `Record` index-signature constraint, so
 * interface-typed items infer cleanly) and defaults to `BreadcrumbItem`.
 */
type VCBreadcrumbComponent = <Item extends BreadcrumbItem = BreadcrumbItem>(
    ...args: Parameters<GenericComponentShape<BreadcrumbPropsGeneric<Item>, BreadcrumbSlots<Item>>>
) => ReturnType<GenericComponentShape<BreadcrumbPropsGeneric<Item>, BreadcrumbSlots<Item>>>;

export default VCBreadcrumb as unknown as VCBreadcrumbComponent;
</script>
