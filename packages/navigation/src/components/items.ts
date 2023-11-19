/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vue-layout/core';
import type { PropType, VNode, VNodeChild } from 'vue';
import { computed, defineComponent, h } from 'vue';
import { SlotName } from '../constants';
import { injectStore } from '../store';
import type { NavigationElement } from '../type';
import { findNavigationElementsForTier } from '../core';
import { VLNavItem } from './item';

export const VLNavItems = defineComponent({
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
        const store = injectStore();

        const items = computed(() => {
            if (typeof props.entities !== 'undefined') {
                return props.entities;
            }

            return findNavigationElementsForTier(store.items.value, props.tier);
        });

        const buildChild = (context: {
            tier?: number,
            component: NavigationElement
        }) : VNodeChild => {
            if (hasNormalizedSlot(SlotName.ITEM, slots)) {
                return normalizeSlot(SlotName.ITEM, context, slots);
            }

            return h(VLNavItem, context);
        };

        const buildChildren = () : VNodeChild => {
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
        }, [buildChildren()]);
    },
});

export default VLNavItems;
