/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    PropType, VNode, computed, defineComponent, h,
} from 'vue';
import { getComponents, useStore } from './store';
import { NavigationElement } from './type';
import { NavigationComponent } from './NavigationComponent';

export const NavigationComponents = defineComponent({
    name: 'NavigationComponents',
    props: {
        tier: {
            type: Number,
            default: 0,
        },
        entities: {
            type: Array as PropType<NavigationElement[]>,
            default: undefined,
        },
    },
    setup(props) {
        useStore();

        const items = computed(() => {
            if (typeof props.entities !== 'undefined') {
                return props.entities;
            }

            return getComponents(props.tier);
        });

        const buildEntities = () => {
            const entities : VNode[] = [];

            if (items.value) {
                for (let i = 0; i < items.value.length; i++) {
                    if (items.value[i].display) {
                        entities.push(h(
                            'li',
                            {
                                key: i,
                            },
                            [
                                h(NavigationComponent, {
                                    tier: props.tier,
                                    component: items.value[i],
                                }),
                            ],
                        ));
                    }
                }
            }

            return entities;
        };

        return () => h('ul', {
            class: 'nav-items',
        }, buildEntities());
    },
});

export default NavigationComponents;
