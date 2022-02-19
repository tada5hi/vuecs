/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import Vue, { CreateElement, PropType, VNode } from 'vue';
import { NavigationComponentConfig } from '../type';
import { NavigationComponent } from './NavigationComponent';

type Properties = {
    tier: number,
    entities: NavigationComponentConfig[]
};

export const NavigationComponents = Vue.extend<any, any, any, Properties>({
    name: 'NavigationComponents',
    props: {
        tier: {
            type: Number,
            default: 0,
        },
        entities: {
            type: Array as PropType<NavigationComponentConfig[]>,
            default: undefined,
        },
    },

    computed: {
        items() {
            if (typeof this.entities !== 'undefined') {
                return this.entities;
            }

            return this.$store.getters['layout/navigationComponents'](this.tier);
        },
    },
    render(createElement: CreateElement): VNode {
        const vm = this;
        const h = createElement;

        const entities : VNode[] = [];

        if (vm.items) {
            for (let i = 0; i < vm.items.length; i++) {
                const entity: NavigationComponentConfig = vm.items[i];

                if (entity.display) {
                    entities.push(h('li', {
                        key: i,
                    }, [
                        h(NavigationComponent, {
                            props: {
                                tier: vm.tier,
                                component: entity,
                            },
                        }),
                    ]));
                }
            }
        }

        return h('ul', {
            staticClass: 'nav-items',
        }, entities);
    },
});

export default NavigationComponents;
