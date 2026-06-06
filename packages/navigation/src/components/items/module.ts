import {
    hasNormalizedSlot,
    isPromise,
    normalizeSlot,
    useArrowNavigation,
    useComponentTheme,
} from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import type {
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNodeArrayChildren,
    VNodeChild,
    WatchSource,
} from 'vue';
import {
    computed,
    defineComponent,
    getCurrentInstance,
    h,
    onMounted,
    onUnmounted,
    provide,
    ref,
    watch,
    watchEffect,
} from 'vue';
import { NavigationMenuList, NavigationMenuRoot } from 'reka-ui';
import { SlotName } from '../../constants';
import type {
    NavigationItem,
    NavigationItemNormalized,
    NavigationOrientation,
    NavigationResolver,
    NavigationSubmenu,
} from '../../types';
import type { NavigationThemeClasses } from '../../helpers/component/types';
import {
    collectTrail,
    findBestItemMatches,
    flattenWhere,
    normalizeItems,
    resetItemsByTrace,
    resolveSubmenuMode,
} from '../../helpers';
import { NavigationRegistry, tryInjectNavigationRegistry } from '../../registry';
import { VCNavItem } from '../item';
import { NAVIGATION_SELECT_KEY } from '../select-context';
import type { NavItemsItemSlotProps } from '../type';
import { navigationThemeDefaults } from './theme';

const navItemsProps = {
    level: { type: Number, default: 0 },
    /**
     * Internal: pre-normalized children handed down by a parent
     * `<VCNavItem>`. When set, this instance renders as-is and does NOT
     * resolve / score (tree-wide scoring stays at the top-level nav).
     */
    data: { type: Array as PropType<NavigationItemNormalized[]>, default: undefined },
    /**
     * The source of this nav's items. Plain array, sync fn, or async fn.
     * A fn receives a NavigationResolverContext and may read reactive
     * state freely — the nav re-runs it automatically when that state
     * changes.
     */
    resolver: {
        type: [Array, Function] as PropType<NavigationResolver>,
        default: undefined,
    },
    /** Opt in to publishing this nav's resolved output into the registry. */
    registry: { type: Boolean, default: false },
    /** The key under which to publish. Required when `registry` is true. */
    registryId: { type: String, default: undefined },
    /**
     * Current path for active-state matching. When omitted, the nav softly
     * reads vue-router's current route (via the `$route` global property)
     * if a router is installed; router-free apps simply get `undefined`.
     */
    path: { type: String, default: undefined },
    /**
     * Extra reactive deps that should retrigger the resolver — for state
     * read only AFTER the first `await` in an async resolver (auto-track
     * can't see past an await).
     */
    watch: { type: Array as PropType<WatchSource[]>, default: undefined },
    variant: { type: String, default: undefined },
    orientation: { type: String as PropType<NavigationOrientation>, default: undefined },
    /**
     * How items with children render their submenu. `auto` derives from
     * orientation (horizontal → dropdown, otherwise collapse).
     */
    submenu: { type: String as PropType<NavigationSubmenu>, default: 'auto' },
    themeClass: { type: Object as PropType<ThemeClassesOverride<NavigationThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type NavItemsProps = ExtractPublicPropTypes<typeof navItemsProps>;

export const VCNavItems = defineComponent({
    name: 'VCNavItems',
    props: navItemsProps,
    slots: Object as SlotsType<{
        item: NavItemsItemSlotProps;
    }>,
    setup(props, { slots, expose }) {
        // Merge the convenience `variant` prop into themeVariant before
        // resolution so themes can drive slot classes off it. Getter keeps
        // it reactive (computed() inside useComponentTheme tracks the read).
        const themeProps: UseComponentThemeProps<NavigationThemeClasses> = {
            get themeClass() {
                return props.themeClass;
            },
            get themeVariant() {
                return {
                    ...(props.themeVariant ?? {}),
                    ...(props.variant !== undefined ? { variant: props.variant } : {}),
                    ...(props.orientation !== undefined ? { orientation: props.orientation } : {}),
                };
            },
        };

        const theme = useComponentTheme('navigation', themeProps, navigationThemeDefaults);

        const rootRef = ref<HTMLUListElement | null>(null);

        const onKeyDown = (event: KeyboardEvent) => {
            useArrowNavigation(
                event,
                event.target as HTMLElement | null,
                rootRef.value,
                {
                    arrowKeyOptions: 'vertical',
                    focus: true,
                    loop: true,
                },
            );
        };

        // Registry is empty-safe: a standalone nav (no plugin installed)
        // falls back to a local empty registry so `registry(id)` still works.
        const registry = tryInjectNavigationRegistry() ?? new NavigationRegistry();

        // Soft vue-router lookup: vue-router installs a reactive `$route`
        // getter on `globalProperties`. Reading it inside a computed tracks
        // route changes without a static `vue-router` import, so router-free
        // apps degrade to `undefined` instead of failing to resolve the
        // module. An explicit `:path` prop always wins.
        const globals = getCurrentInstance()?.appContext.config.globalProperties;
        const currentPath = computed<string | undefined>(() => {
            if (typeof props.path !== 'undefined') {
                return props.path;
            }
            const route = globals?.$route as { path?: string } | undefined;
            return route?.path;
        });

        // --- click-driven selection (url-less section switchers) ---
        // A url-less item can't navigate, so a click "selects" it instead:
        // we record its trace and fold it into active-state derivation
        // below, publishing it through the registry like a route change.
        // Only the root nav (resolver mode; `data` undefined) holds this
        // state and provides the bridge — nested `<VCNavItems>` (data set)
        // let the click bubble up to their owning root.
        const selectedTrace = ref<string[] | null>(null);
        if (typeof props.data === 'undefined') {
            provide(NAVIGATION_SELECT_KEY, {
                select: (item) => {
                    selectedTrace.value = item.trace;
                },
            });
            // A real navigation supersedes a prior selection: once the
            // route changes, hand active-state back to path matching.
            watch(currentPath, () => {
                selectedTrace.value = null;
            });
        }

        // --- resolver + reactivity (resolver mode only; `data` bypasses) ---
        const raw = ref<NavigationItem[]>([]);

        async function run() {
            const value = typeof props.resolver === 'function' ?
                props.resolver({
                    path: currentPath.value,
                    registry: (id: string) => registry.get(id),
                }) :
                (props.resolver ?? []);

            raw.value = isPromise(value) ? ((await value) ?? []) : (value ?? []);
        }

        if (typeof props.data === 'undefined') {
            // Auto-track: reactive reads in `run` BEFORE the first await retrigger it.
            watchEffect(run);
            // Escape hatch for state read AFTER an await:
            if (props.watch) {
                watch(props.watch, run);
            }
        }

        // Imperative escape hatch:
        expose({ refresh: run });

        // --- normalized + tree-wide scored derivation ---
        const resolved = computed<{ items: NavigationItemNormalized[]; trace: string[] }>(() => {
            if (typeof props.data !== 'undefined') {
                return { items: props.data, trace: [] };
            }

            const normalized = normalizeItems(raw.value, { level: props.level });
            const [match] = findBestItemMatches(normalized, { path: currentPath.value });
            // A click-driven selection (url-less switcher) overrides the
            // path match until the next real navigation clears it.
            const trace = selectedTrace.value ?? (match ? match.trace : []);
            // sets per item: .active (exact) AND .activeWithin (ancestor)
            resetItemsByTrace(normalized, trace);
            return { items: normalized, trace };
        });

        const items = computed(() => resolved.value.items);
        const active = computed(() => flattenWhere(items.value, (item) => !!item.active));
        const activeTrail = computed(() => collectTrail(items.value, resolved.value.trace));

        // --- registry publish (opt-in, lifecycle-bound) ---
        if (props.registry) {
            let unsubscribeFn : (() => void) | undefined;

            const entry = {
                items,
                active,
                activeTrail,
            };

            onMounted(() => {
                if (!props.registryId) {
                    // eslint-disable-next-line no-console
                    console.warn('[vuecs] <VCNavItems registry> requires a `registry-id`.');
                    return;
                }
                unsubscribeFn = registry.register(props.registryId, entry);
            });
            onUnmounted(() => {
                if (!props.registryId || !unsubscribeFn) {
                    return;
                }

                unsubscribeFn();
            });
        }

        const submenuMode = computed(() => resolveSubmenuMode(props.submenu, props.orientation));

        return () => {
            const resolvedTheme = theme.value;
            const vNodes: VNodeArrayChildren = [];

            for (let i = 0; i < items.value.length; i++) {
                const item = items.value[i];
                if (!item.display && !item.displayChildren) {
                    continue;
                }

                let vNode: VNodeChild;
                if (hasNormalizedSlot(SlotName.ITEM, slots)) {
                    vNode = normalizeSlot(SlotName.ITEM, { data: item }, slots);
                } else {
                    vNode = h(
                        VCNavItem,
                        {
                            key: item.trace.join('/') || i,
                            data: item,
                            variant: props.variant,
                            orientation: props.orientation,
                            submenu: submenuMode.value,
                            themeClass: props.themeClass,
                            themeVariant: props.themeVariant,
                        },
                    );
                }

                vNodes.push(vNode);
            }

            // Dropdown mode wraps the list in Reka's NavigationMenu so group
            // triggers get flyout machinery (hover-grace, edge-aware content,
            // arrow-key nav). Collapse mode stays a plain <ul> and wires our
            // own arrow-navigation on the root.
            if (submenuMode.value === 'dropdown') {
                return h(
                    NavigationMenuRoot,
                    { orientation: 'horizontal' },
                    {
                        default: () => h(
                            NavigationMenuList,
                            { class: resolvedTheme.group || undefined },
                            { default: () => vNodes },
                        ),
                    },
                );
            }

            const isRoot = props.level === 0 && typeof props.data === 'undefined';

            return h(
                'ul',
                {
                    class: resolvedTheme.group || undefined,
                    ...(isRoot ?
                        { ref: rootRef, onKeydown: onKeyDown } :
                        {}),
                },
                vNodes,
            );
        };
    },
});
