import { hasNormalizedSlot, normalizeSlot, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { LinkProperties } from '@vuecs/link';
import { VCLink } from '@vuecs/link';
import type { PropType, SlotsType, VNodeChild } from 'vue';
import {
    computed,
    defineComponent,
    h,
    resolveComponent,
    toRef,
} from 'vue';
import { injectNavigationManager } from '../../manager';
import type { NavigationItemNormalized } from '../../types';
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

const themeDefaults = {
    classes: {
        group: 'vc-nav-items',
        item: 'vc-nav-item',
        itemNested: 'vc-nav-item-nested',
        separator: 'vc-nav-separator',
        link: 'vc-nav-link',
        linkRoot: 'vc-nav-link-root',
        linkIcon: 'vc-nav-link-icon',
        linkText: 'vc-nav-link-text',
    },
};

export const VCNavItem = defineComponent({
    name: 'VCNavItem',
    props: {
        data: {
            type: Object as PropType<NavigationItemNormalized>,
            required: true,
        },
        themeClass: {
            type: Object as PropType<ThemeClassesOverride<NavigationThemeClasses>>,
            default: undefined,
        },
        themeVariant: {
            type: Object as PropType<VariantValues>,
            default: undefined,
        },
    },
    slots: Object as SlotsType<{
        separator: NavItemSeparatorSlotProps;
        link: NavItemLinkSlotProps;
        sub: NavItemSubSlotProps;
        'sub-title': NavItemSubTitleSlotProps;
        'sub-items': NavItemSubItemsSlotProps;
    }>,
    setup(props, { slots }) {
        const itemsNode = resolveComponent('VCNavItems');

        const theme = useComponentTheme('navigation', props, themeDefaults);
        const manager = injectNavigationManager();

        const data = toRef(props, 'data');
        const hasChildren = computed(() => data.value.children &&
            data.value.children.length > 0);

        const select = async (
            value: NavigationItemNormalized,
        ) => {
            await manager.select(data.value.level, value);
        };

        const toggle = async (
            value: NavigationItemNormalized,
        ) => {
            await manager.toggle(data.value.level, value);
        };

        return () => {
            const resolved = theme.value;

            const buildItem = (): VNodeChild => {
                // type: separator
                if (data.value.type === ElementType.SEPARATOR) {
                    const hasSlot = hasNormalizedSlot(SlotName.SEPARATOR, slots);
                    if (hasSlot) {
                        return normalizeSlot(SlotName.SEPARATOR, { data: data.value }, slots);
                    }

                    return h('div', { class: resolved.separator || undefined }, data.value.name);
                }

                // type: link (no children)
                if (!hasChildren.value) {
                    const hasSlot = hasNormalizedSlot(SlotName.LINK, slots);
                    if (hasSlot) {
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
                        onClicked() {
                            if (!data.value.url) {
                                return select.call(null, data.value);
                            }
                            return undefined;
                        },
                        onClick() {
                            return select.call(null, data.value);
                        },
                    }, {
                        default: () => [
                            ...(data.value.icon ?
                                [h('div', { class: resolved.linkIcon || undefined }, [
                                    h('i', { class: data.value.icon }),
                                ])] :
                                []),
                            h('div', { class: resolved.linkText || undefined }, [
                                data.value.name,
                            ]),
                        ],
                    });
                }

                // type: group with children
                if (hasNormalizedSlot(SlotName.SUB, slots)) {
                    return normalizeSlot(SlotName.SUB, {
                        data: data.value,
                        select,
                        toggle,
                    }, slots);
                }

                let title: VNodeChild;
                if (hasNormalizedSlot(SlotName.SUB_TITLE, slots)) {
                    title = normalizeSlot(SlotName.SUB_TITLE, {
                        data: data.value,
                        select,
                        toggle,
                    });
                } else {
                    title = h('div', {
                        class: resolved.link,
                        'data-vc-collection-item': '',
                        tabindex: 0,
                        role: 'button',
                        onClick($event: any) {
                            $event.preventDefault();
                            return toggle(data.value);
                        },
                        onKeydown($event: KeyboardEvent) {
                            if ($event.key === 'Enter' || $event.key === ' ') {
                                $event.preventDefault();
                                return toggle(data.value);
                            }
                            return undefined;
                        },
                    }, [
                        ...(data.value.icon ?
                            [h('div', { class: resolved.linkIcon || undefined }, [
                                h('i', { class: data.value.icon }),
                            ])] :
                            []),
                        h('div', { class: resolved.linkText || undefined }, [
                            data.value.name,
                        ]),
                    ]);
                }

                if (!hasChildren.value) {
                    return title;
                }

                let vNodes: VNodeChild;
                if (hasNormalizedSlot(SlotName.SUB_ITEMS, slots)) {
                    vNodes = normalizeSlot(SlotName.SUB_ITEMS, {
                        data: data.value,
                        select,
                        toggle,
                    });
                } else {
                    vNodes = h(itemsNode, {
                        level: data.value.level,
                        data: data.value.children,
                    });
                }

                return [title, vNodes];
            };

            return h('li', {
                class: [
                    resolved.item,
                    ...(hasChildren.value ? [resolved.itemNested] : []),
                    { active: data.value.active || data.value.displayChildren },
                ],
            }, [buildItem()]);
        };
    },
});
