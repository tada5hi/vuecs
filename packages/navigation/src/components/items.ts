/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type { PropType, VNode, VNodeChild } from 'vue';
import { computed, defineComponent, h } from 'vue';
import { SlotName } from '../constants';
import { injectStore } from '../store';
import type { NavigationItem } from '../type';
import { findNavigationItemsForTier } from '../core';
import { VCNavItem } from './item';

export const VCNavItems = defineComponent({
    props: {
        tier: {
            type: Number,
            default: 0,
        },
        entities: {
            type: Array as PropType<NavigationItem[]>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const store = injectStore();

        const items = computed(() => {
            if (typeof props.entities !== 'undefined') {
                return props.entities;
            }

            return findNavigationItemsForTier(store.items.value, props.tier);
        });

        const buildChild = (context: {
            tier?: number,
            component: NavigationItem
        }) : VNodeChild => {
            if (hasNormalizedSlot(SlotName.ITEM, slots)) {
                return normalizeSlot(SlotName.ITEM, context, slots);
            }

            return h(VCNavItem, context);
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
