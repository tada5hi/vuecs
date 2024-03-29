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
import {
    injectStore,
} from '../store';
import type { NavigationItem } from '../type';
import {
    selectNavigationTierItem,
    toggleNavigation,
} from '../core';
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
        const store = injectStore();
        const component = toRef(props, 'component') as Ref<NavigationItem>;

        const selectComponent = async (value: NavigationItem) => {
            await selectNavigationTierItem(store, props.tier, value);
        };

        const toggleComponentExpansion = async (
            value: NavigationItem,
        ) => toggleNavigation(store, props.tier, value);

        return () => {
            const buildItem = () : VNodeChild => {
                let item : VNodeChild;

                switch (component.value.type) {
                    case ElementType.SEPARATOR: {
                        const hasSlot = hasNormalizedSlot(SlotName.SEPARATOR, slots);
                        if (hasSlot) {
                            item = normalizeSlot(SlotName.SEPARATOR, {
                                component: component.value,
                            }, slots);
                        } else {
                            item = h('div', {
                                class: 'nav-separator',
                            }, component.value.name);
                        }
                        break;
                    }
                    default: {
                        if (typeof component.value.children === 'undefined') {
                            const hasSlot = hasNormalizedSlot(SlotName.LINK, slots);
                            if (hasSlot) {
                                item = normalizeSlot(SlotName.LINK, {
                                    component: component.value,
                                    selectComponent,
                                    isActive: component.value.active,
                                }, slots);
                            } else {
                                const linkProps : LinkProperties = {
                                    active: component.value.active,
                                    disabled: false,
                                    prefetch: true,
                                };

                                if (component.value.url) {
                                    if (
                                        isAbsoluteURL(component.value.url) ||
                                        component.value.url.startsWith('#')
                                    ) {
                                        linkProps.href = component.value.url;
                                        if (component.value.urlTarget) {
                                            linkProps.target = component.value.urlTarget;
                                        }
                                    } else {
                                        linkProps.to = component.value.url;
                                    }
                                }

                                item = h(VCLink, {
                                    class: [
                                        'nav-link',
                                        {
                                            'root-link': component.value.root,
                                        },
                                    ],
                                    ...linkProps,
                                    onClicked() {
                                        if (!component.value.url) {
                                            return selectComponent.call(null, component.value);
                                        }

                                        return undefined;
                                    },
                                    onClick() {
                                        return selectComponent.call(null, component.value);
                                    },
                                }, {
                                    default: () => [
                                        ...(component.value.icon ? [h('i', { class: component.value.icon })] : []),
                                        h('span', { class: 'nav-link-text' }, [component.value.name]),
                                    ],
                                });
                            }
                        } else if (hasNormalizedSlot(SlotName.SUB, slots)) {
                            item = normalizeSlot(SlotName.SUB, {
                                component: component.value,
                                selectComponent,
                                toggleComponentExpansion,
                            }, slots);
                        } else {
                            let title : VNodeChild;
                            if (hasNormalizedSlot(SlotName.SUB_TITLE, slots)) {
                                title = normalizeSlot(SlotName.SUB_TITLE, {
                                    component: component.value,
                                    selectComponent,
                                    toggleComponentExpansion,
                                });
                            } else {
                                title = h('div', {
                                    class: 'nav-sub-title',
                                    onClick($event: any) {
                                        $event.preventDefault();

                                        return toggleComponentExpansion.call(null, component.value);
                                    },
                                }, [[
                                    ...(component.value.icon ? [h('i', { class: component.value.icon })] : []),
                                    h('span', { class: 'nav-link-text' }, [component.value.name]),
                                ]]);
                            }

                            let items : VNodeChild;

                            if (hasNormalizedSlot(SlotName.SUB_ITEMS, slots)) {
                                items = normalizeSlot(SlotName.SUB_ITEMS, {
                                    component: component.value,
                                    selectComponent,
                                    toggleComponentExpansion,
                                });
                            } else if (component.value.displayChildren) {
                                const navigationComponents = resolveComponent('VCNavItems');
                                items = h(navigationComponents, {
                                    class: 'list-unstyled nav-sub-items',
                                    tier: props.tier,
                                    entities: component.value.children,
                                });
                            }

                            item = [
                                title,
                                items,
                            ];
                        }
                        break;
                    }
                }

                return item;
            };

            return h('div', {
                class: [
                    'nav-item',
                    {
                        active: component.value.active || component.value.displayChildren,
                    },
                ],
            }, [
                buildItem(),
            ]);
        };
    },
});
