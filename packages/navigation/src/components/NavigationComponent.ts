/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import Vue, { CreateElement, PropType, VNode } from 'vue';
import { NavigationComponentConfig, isNavigationComponentMatch } from '..';
import { hasNormalizedSlot, normalizeSlot } from './utils/normalize-slot';
import { SlotName } from './constants';
import { NavigationComponents } from './NavigationComponents';

type Properties = {
    tier: number,
    component: NavigationComponentConfig
};

export const NavigationComponent = Vue.extend<any, any, any, Properties>({
    name: 'NavigationComponent',
    props: {
        tier: {
            type: Number,
            default: 0,
        },
        component: {
            type: Object as PropType<NavigationComponentConfig>,
            required: true,
            default: undefined,
        },
    },
    computed: {
        isStrictMatch() {
            return isNavigationComponentMatch(
                this.$store.getters['layout/navigationComponent'](this.tier),
                this.component,
                true,
            );
        },
        isMatch() {
            return isNavigationComponentMatch(
                this.$store.getters['layout/navigationComponent'](this.tier),
                this.component,
                false,
            ) || this.isChildrenMatch;
        },
        isChildrenMatch() {
            return !!(this.component.components && this.component.displayChildren);
        },
    },
    methods: {
        async selectComponent(component: NavigationComponentConfig) {
            await this.$store.dispatch('layout/selectNavigation', {
                tier: this.tier,
                component,
            });

            if (component.url) {
                if (this.$router.history.current.path === component.url) {
                    return;
                }

                // todo: check if it is absolute link :)
                await this.$router.push({
                    path: component.url,
                });
            }
        },
        async toggleComponentExpansion(component: NavigationComponentConfig) {
            await this.$store.dispatch('layout/toggleNavigationExpansion', {
                tier: this.tier,
                component,
            });
        },
    },
    render(createElement: CreateElement): VNode {
        const vm = this;
        const h = createElement;

        const $scopedSlots = vm.$scopedSlots || {};
        const $slots = vm.$slots || {};

        let item : VNode | string | (VNode | string)[] = h();

        switch (vm.component.type) {
            case 'separator': {
                const hasSlot = hasNormalizedSlot(SlotName.SEPARATOR, $scopedSlots, $slots);
                if (hasSlot) {
                    item = normalizeSlot(SlotName.SEPARATOR, {
                        component: vm.component,
                    }, $scopedSlots, $slots);
                } else {
                    item = h('div', {
                        staticClass: 'nav-separator',
                    }, [vm.component.name]);
                }
                break;
            }
            default: {
                if (typeof vm.component.components === 'undefined') {
                    const hasSlot = hasNormalizedSlot(SlotName.LINK, $scopedSlots, $slots);
                    if (hasSlot) {
                        item = normalizeSlot(SlotName.LINK, {
                            component: vm.component,
                            selectComponent: vm.selectComponent,
                            isActive: vm.isMatch,
                        }, $scopedSlots, $slots);
                    } else {
                        item = h('a', {
                            staticClass: 'nav-link',
                            class: {
                                'router-link-active': vm.isMatch,
                                'router-link-exact-active': vm.isStrictMatch,
                                active: vm.isMatch,
                                'root-link': vm.component.rootLink,
                            },
                            on: {
                                click($event: any) {
                                    $event.preventDefault();

                                    return vm.selectComponent.call(null, vm.component);
                                },
                            },
                        }, [
                            vm.component.icon ? h('i', { staticClass: vm.component.icon }) : h(),
                            h('span', { staticClass: 'nav-link-text' }, [vm.component.name]),
                        ]);
                    }
                } else if (hasNormalizedSlot(SlotName.SUB, $scopedSlots, $slots)) {
                    item = normalizeSlot(SlotName.SUB, {
                        component: vm.component,
                        selectComponent: vm.selectComponent,
                        toggleComponentExpansion: vm.toggleComponentExpansion,
                    }, $scopedSlots, $slots);
                } else {
                    let title = h();
                    if (hasNormalizedSlot(SlotName.SUB_TITLE, $scopedSlots, $slots)) {
                        title = normalizeSlot(SlotName.SUB_TITLE, {
                            component: vm.component,
                            selectComponent: vm.selectComponent,
                            toggleComponentExpansion: vm.toggleComponentExpansion,
                        });
                    } else {
                        title = h('div', {
                            staticClass: 'nav-sub-title',
                            on: {
                                click($event: any) {
                                    $event.preventDefault();

                                    return vm.toggleComponentExpansion.call(null, vm.component);
                                },
                            },
                        }, [
                            vm.component.icon ? h('i', { staticClass: vm.component.icon }) : h(),
                            h('span', { staticClass: 'nav-link-text' }, [vm.component.name]),
                        ]);
                    }

                    let items = h();

                    if (hasNormalizedSlot(SlotName.SUB_ITEMS, $scopedSlots, $slots)) {
                        items = normalizeSlot(SlotName.SUB_ITEMS, {
                            component: vm.component,
                            selectComponent: vm.selectComponent,
                            toggleComponentExpansion: vm.toggleComponentExpansion,
                        });
                    } else if (vm.component.displayChildren) {
                        items = h(NavigationComponents, {
                            staticClass: 'list-unstyled nav-sub-items',
                            props: {
                                tier: vm.tier,
                                entities: vm.component.components,
                            },
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

        return h('div', {
            staticClass: 'nav-item',
            class: {
                active: vm.isMatch,
            },
        }, Array.isArray(item) ? item : [item]);
    },
});

export default NavigationComponent;
