/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vue-layout/core';
import type { PropType, VNode } from 'vue';
import { computed, defineComponent, h } from 'vue';
import { SlotName } from './constants';
import { getComponents, useStore } from './store';
import type { NavigationElement } from './type';
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
    setup(props, { slots }) {
        useStore();

        const items = computed(() => {
            if (typeof props.entities !== 'undefined') {
                return props.entities;
            }

            return getComponents(props.tier);
        });

        const buildChild = (context: {
            tier?: number,
            component: NavigationElement
        }) => {
            if (hasNormalizedSlot(SlotName.ITEM, slots)) {
                return normalizeSlot(SlotName.ITEM, context, slots);
            }

            return h(NavigationComponent, context);
        };

        const buildChildren = () => {
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
                                buildChild({
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
        }, buildChildren());
    },
});

export default NavigationComponents;
