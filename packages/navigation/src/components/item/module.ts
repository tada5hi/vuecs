import { hasNormalizedSlot, normalizeSlot, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, UseComponentThemeProps, VariantValues } from '@vuecs/core';
import type { LinkProperties } from '@vuecs/link';
import { VCLink } from '@vuecs/link';
import type {
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNodeChild,
} from 'vue';
import {
    computed,
    defineComponent,
    h,
    inject,
    ref,
    resolveComponent,
    toRef,
    watch,
} from 'vue';
import {
    CollapsibleContent,
    CollapsibleRoot,
    CollapsibleTrigger,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger,
} from 'reka-ui';
import type {
    NavigationItemNormalized,
    NavigationOrientation,
    NavigationSubmenuMode,
} from '../../types';
import type { NavigationThemeClasses } from '../../helpers/component/types';
import { isAbsoluteURL } from '../../helpers';
import { ElementType, SlotName } from '../../constants';
import type {
    NavItemLinkSlotProps,
    NavItemSeparatorSlotProps,
    NavItemSubItemsSlotProps,
    NavItemSubSlotProps,
    NavItemSubTitleSlotProps,
} from '../type';
import { navigationThemeDefaults } from '../items/theme';
import { NAVIGATION_SELECT_KEY } from '../select-context';

const navItemProps = {
    data: {
        type: Object as PropType<NavigationItemNormalized>,
        required: true,
    },
    variant: {
        type: String,
        default: undefined,
    },
    orientation: {
        type: String as PropType<NavigationOrientation>,
        default: undefined,
    },
    /**
     * Resolved submenu presentation handed down by the parent
     * `<VCNavItems>`. `collapse` renders groups as an inline
     * Reka `Collapsible`; `dropdown` renders them as Reka
     * `NavigationMenu` flyouts.
     */
    submenu: {
        type: String as PropType<NavigationSubmenuMode>,
        default: 'collapse',
    },
    themeClass: {
        type: Object as PropType<ThemeClassesOverride<NavigationThemeClasses>>,
        default: undefined,
    },
    themeVariant: {
        type: Object as PropType<VariantValues>,
        default: undefined,
    },
};

export type NavItemProps = ExtractPublicPropTypes<typeof navItemProps>;

export const VCNavItem = defineComponent({
    name: 'VCNavItem',
    props: navItemProps,
    slots: Object as SlotsType<{
        separator: NavItemSeparatorSlotProps;
        link: NavItemLinkSlotProps;
        sub: NavItemSubSlotProps;
        'sub-title': NavItemSubTitleSlotProps;
        'sub-items': NavItemSubItemsSlotProps;
    }>,
    setup(props, { slots }) {
        const itemsNode = resolveComponent('VCNavItems');

        const themeProps: UseComponentThemeProps<NavigationThemeClasses> = {
            get themeClass() {
                return props.themeClass;
            },
            get themeVariant() {
                return {
                    ...(props.themeVariant ?? {}),
                    ...(props.variant !== undefined ? { variant: props.variant } : {}),
                };
            },
        };

        const theme = useComponentTheme('navigation', themeProps, navigationThemeDefaults);

        const data = toRef(props, 'data');
        const hasChildren = computed(() => data.value.children &&
            data.value.children.length > 0);

        // Local expand state — seeded from the resolved `displayChildren`
        // (driven by active-trail matching upstream) and resynced whenever
        // that recomputes, so a path change auto-opens the active branch.
        const open = ref(!!data.value.displayChildren);
        watch(() => data.value.displayChildren, (value) => {
            open.value = !!value;
        });

        // Selection bubbles up to the owning root `<VCNavItems>`, which folds
        // this item's trace into its active state and republishes through the
        // registry. The primary use is url-less section switchers (a top-nav
        // tab that swaps a dependent sidebar without navigating). Items with
        // a real url also navigate; the route change then supersedes the
        // selection upstream.
        const selectContext = inject(NAVIGATION_SELECT_KEY, null);
        const select = () => {
            selectContext?.select(data.value);
        };

        const toggle = () => {
            open.value = !open.value;
        };

        // Iconify-style icon strings (e.g. `fa6-solid:home`, `lucide:plus`)
        // contain a colon. Render via the globally-registered <VCIcon> so
        // they resolve through the Iconify pipeline rather than landing as
        // raw CSS classes on a literal <i>. Legacy class-string icons
        // (`fa fa-home`, `material-icons home`) keep their <i class> rendering.
        const renderIcon = (icon: string): VNodeChild => {
            if (icon.includes(':')) {
                return h(resolveComponent('VCIcon'), { name: icon });
            }
            return h('i', { class: icon });
        };

        const renderTitleInner = (resolved: NavigationThemeClasses): VNodeChild[] => [
            ...(data.value.icon ?
                [h('div', { class: resolved.linkIcon || undefined }, [
                    renderIcon(data.value.icon),
                ])] :
                []),
            h('div', { class: resolved.linkText || undefined }, [
                data.value.name,
            ]),
        ];

        const renderLeaf = (resolved: NavigationThemeClasses): VNodeChild => {
            if (hasNormalizedSlot(SlotName.LINK, slots)) {
                return normalizeSlot(SlotName.LINK, {
                    data: data.value,
                    select,
                    isActive: data.value.active,
                }, slots);
            }

            const linkProps: LinkProperties = {
                active: data.value.active,
                disabled: false,
                prefetch: true,
            };

            if (data.value.url) {
                if (
                    isAbsoluteURL(data.value.url) ||
                    data.value.url.startsWith('#')
                ) {
                    linkProps.href = data.value.url;
                    if (data.value.urlTarget) {
                        linkProps.target = data.value.urlTarget;
                    }
                } else {
                    linkProps.to = data.value.url;
                }
            }

            return h(VCLink, {
                class: [resolved.link],
                'data-vc-collection-item': '',
                ...linkProps,
                onClicked: select,
            }, { default: () => renderTitleInner(resolved) });
        };

        const renderChildren = (): VNodeChild => {
            if (hasNormalizedSlot(SlotName.SUB_ITEMS, slots)) {
                return normalizeSlot(SlotName.SUB_ITEMS, {
                    data: data.value,
                    select,
                    toggle,
                });
            }

            return h(itemsNode, {
                data: data.value.children,
                variant: props.variant,
                orientation: props.orientation,
                submenu: props.submenu,
                themeClass: props.themeClass,
                themeVariant: props.themeVariant,
            });
        };

        return () => {
            const resolved = theme.value;
            const isDropdown = props.submenu === 'dropdown';
            const isActive = data.value.active || data.value.activeWithin;

            // type: separator
            if (data.value.type === ElementType.SEPARATOR) {
                const body = hasNormalizedSlot(SlotName.SEPARATOR, slots) ?
                    normalizeSlot(SlotName.SEPARATOR, { data: data.value }, slots) :
                    h('div', { class: resolved.separator || undefined }, data.value.name);

                if (isDropdown) {
                    return h(NavigationMenuItem, { class: [resolved.item] }, { default: () => body });
                }
                return h('li', { class: [resolved.item] }, [body]);
            }

            // type: link (no children)
            if (!hasChildren.value) {
                const leaf = renderLeaf(resolved);

                if (isDropdown) {
                    return h(NavigationMenuItem, {
                        class: [resolved.item],
                        'data-active': data.value.active ? '' : undefined,
                    }, {
                        default: () => h(NavigationMenuLink, {
                            active: data.value.active,
                            asChild: true,
                        }, { default: () => leaf }),
                    });
                }

                return h('li', {
                    class: [resolved.item, { active: data.value.active }],
                    'data-active': data.value.active ? '' : undefined,
                }, [leaf]);
            }

            // type: group with children — full-override slot bypasses the
            // Collapsible / NavigationMenu machinery entirely.
            if (hasNormalizedSlot(SlotName.SUB, slots)) {
                const body = normalizeSlot(SlotName.SUB, {
                    data: data.value,
                    select,
                    toggle,
                }, slots);

                if (isDropdown) {
                    return h(NavigationMenuItem, {
                        class: [resolved.item, resolved.itemNested],
                        'data-active': isActive ? '' : undefined,
                    }, { default: () => body });
                }
                return h('li', {
                    class: [resolved.item, resolved.itemNested, { active: isActive }],
                    'data-active': isActive ? '' : undefined,
                }, [body]);
            }

            const title = hasNormalizedSlot(SlotName.SUB_TITLE, slots) ?
                normalizeSlot(SlotName.SUB_TITLE, {
                    data: data.value,
                    select,
                    toggle,
                }) :
                renderTitleInner(resolved);

            const children = renderChildren();

            // dropdown: Reka NavigationMenu flyout
            if (isDropdown) {
                return h(NavigationMenuItem, {
                    class: [resolved.item, resolved.itemNested],
                    'data-active': isActive ? '' : undefined,
                }, {
                    default: () => [
                        h(NavigationMenuTrigger, {
                            class: resolved.trigger || undefined,
                            'data-vc-collection-item': '',
                            'data-active': isActive ? '' : undefined,
                        }, { default: () => title }),
                        h(NavigationMenuContent, { class: resolved.content || undefined }, { default: () => children }),
                    ],
                });
            }

            // collapse: inline Reka Collapsible
            return h(CollapsibleRoot, {
                as: 'li',
                class: [
                    resolved.item,
                    resolved.itemNested,
                    { active: data.value.active || open.value },
                ],
                'data-active': isActive ? '' : undefined,
                open: open.value,
                'onUpdate:open': (value: boolean) => {
                    open.value = value;
                },
            }, {
                default: () => [
                    h(CollapsibleTrigger, {
                        class: resolved.trigger || undefined,
                        'data-vc-collection-item': '',
                        'data-active': isActive ? '' : undefined,
                    }, { default: () => title }),
                    h(CollapsibleContent, { class: resolved.content || undefined }, { default: () => children }),
                ],
            });
        };
    },
});
