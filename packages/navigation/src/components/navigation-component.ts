/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vue-layout/core';
import type { PropType, Ref, VNodeChild } from 'vue';
import {
    computed, defineComponent, h, resolveComponent, toRef, unref,
} from 'vue';
import { getActiveComponent, selectNavigationElement, toggleNavigation } from '../store';
import type { NavigationElement } from '../type';
import { isAbsoluteURL, isNavigationElementMatch } from '../utils';
import type { LinkProperties } from './type';
import { SlotName } from '../constants';
import { MyLink } from './my-link';

export const NavigationComponent = defineComponent({
    name: 'NavigationComponent',
    props: {
        tier: {
            type: Number,
            default: 0,
        },
        component: {
            type: Object as PropType<NavigationElement>,
        },
    },
    setup(props, { slots }) {
        const component = toRef(props, 'component') as Ref<NavigationElement>;

        const componentActive = computed(() => getActiveComponent(props.tier));
        const isStrictMatch = computed(() => isNavigationElementMatch(componentActive, component));
        const isMatch = computed(() => isNavigationElementMatch(componentActive, component, false));

        const selectComponent = async (value: NavigationElement) => {
            await selectNavigationElement(props.tier, value);
        };

        const toggleComponentExpansion = async (value: NavigationElement) => {
            await toggleNavigation(props.tier, value);
        };

        const buildItem = () => {
            let item : VNodeChild;

            switch (component.value.type) {
                case 'separator': {
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
                                isActive: isMatch,
                            }, slots);
                        } else {
                            const linkProps : LinkProperties = {
                                active: unref(isMatch),
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

                            item = h(MyLink, {
                                class: [
                                    'nav-link',
                                    {
                                        'router-link-active': isMatch.value,
                                        'router-link-exact-active': isStrictMatch.value,
                                        active: isMatch.value,
                                        'root-link': component.value.rootLink,
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
                            const navigationComponents = resolveComponent('NavigationComponents');
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

        return () => h('div', {
            class: [
                'nav-item',
                {
                    active: isMatch.value || component.value.displayChildren,
                },
            ],
        }, [
            buildItem(),
        ]);
    },
});

export default NavigationComponent;
