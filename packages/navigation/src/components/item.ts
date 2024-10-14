import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { LinkProperties } from '@vuecs/link';
import { VCLink } from '@vuecs/link';
import type { PropType, Ref, VNodeChild } from 'vue';
import {
    defineComponent,
    h,
    resolveComponent,
    toRef,
} from 'vue';
import { injectManager } from '../singleton';
import type { NavigationItem } from '../type';
import { isAbsoluteURL } from '../utils';
import { ElementType, SlotName } from '../constants';

export const VCNavItem = defineComponent({
    props: {
        tier: {
            type: Number,
            default: 0,
        },
        component: {
            type: Object as PropType<NavigationItem>,
            required: true,
        },
    },
    setup(props, { slots }) {
        const itemsNode = resolveComponent('VCNavItems');
        const manager = injectManager();

        const item = toRef(props, 'component') as Ref<NavigationItem>;

        const select = async (value: NavigationItem) => {
            await manager.select(props.tier, {
                ...value,
                children: [
                    ...(value.children || []),
                ],
            });
        };

        const toggle = async (
            value: NavigationItem,
        ) => {
            await manager.toggle(props.tier, {
                ...value,
                children: [
                    ...(value.children || []),
                ],
            });
        };

        return () => {
            const buildItem = () : VNodeChild => {
                if (item.value.type === ElementType.SEPARATOR) {
                    const hasSlot = hasNormalizedSlot(SlotName.SEPARATOR, slots);
                    if (hasSlot) {
                        return normalizeSlot(SlotName.SEPARATOR, {
                            component: item.value,
                        }, slots);
                    }
                    return h('div', {
                        class: 'nav-separator',
                    }, item.value.name);
                }

                let vNode : VNodeChild;
                if (typeof item.value.children === 'undefined') {
                    const hasSlot = hasNormalizedSlot(SlotName.LINK, slots);
                    if (hasSlot) {
                        vNode = normalizeSlot(SlotName.LINK, {
                            component: item.value,
                            select,
                            isActive: item.value.active,
                        }, slots);
                    } else {
                        const linkProps : LinkProperties = {
                            active: item.value.active,
                            disabled: false,
                            prefetch: true,
                        };

                        if (item.value.url) {
                            if (
                                isAbsoluteURL(item.value.url) ||
                                        item.value.url.startsWith('#')
                            ) {
                                linkProps.href = item.value.url;
                                if (item.value.urlTarget) {
                                    linkProps.target = item.value.urlTarget;
                                }
                            } else {
                                linkProps.to = item.value.url;
                            }
                        }

                        vNode = h(VCLink, {
                            class: [
                                'nav-link',
                                {
                                    'root-link': item.value.root,
                                },
                            ],
                            ...linkProps,
                            onClicked() {
                                if (!item.value.url) {
                                    return select.call(null, item.value);
                                }

                                return undefined;
                            },
                            onClick() {
                                return select.call(null, item.value);
                            },
                        }, {
                            default: () => [
                                ...(item.value.icon ? [h('i', { class: item.value.icon })] : []),
                                h('span', { class: 'nav-link-text' }, [item.value.name]),
                            ],
                        });
                    }
                } else if (hasNormalizedSlot(SlotName.SUB, slots)) {
                    vNode = normalizeSlot(SlotName.SUB, {
                        component: item.value,
                        select,
                        toggle,
                    }, slots);
                } else {
                    let title : VNodeChild;
                    if (hasNormalizedSlot(SlotName.SUB_TITLE, slots)) {
                        title = normalizeSlot(SlotName.SUB_TITLE, {
                            component: item.value,
                            select,
                            toggle,
                        });
                    } else {
                        title = h('div', {
                            class: 'nav-sub-title',
                            onClick($event: any) {
                                $event.preventDefault();

                                return toggle(item.value);
                            },
                        }, [[
                            ...(item.value.icon ? [h('i', { class: item.value.icon })] : []),
                            h('span', { class: 'nav-link-text' }, [item.value.name]),
                        ]]);
                    }

                    let vNodes : VNodeChild;

                    if (hasNormalizedSlot(SlotName.SUB_ITEMS, slots)) {
                        vNodes = normalizeSlot(SlotName.SUB_ITEMS, {
                            component: item.value,
                            select,
                            toggle,
                        });
                    } else if (item.value.displayChildren) {
                        vNodes = h(itemsNode, {
                            class: 'list-unstyled nav-sub-items',
                            tier: props.tier,
                            entities: item.value.children,
                        });
                    }

                    vNode = [
                        title,
                        vNodes,
                    ];
                }

                return vNode;
            };

            return h('div', {
                class: [
                    'nav-item',
                    {
                        active: item.value.active || item.value.displayChildren,
                    },
                ],
            }, [
                buildItem(),
            ]);
        };
    },
});
