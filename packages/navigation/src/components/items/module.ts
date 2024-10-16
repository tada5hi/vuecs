/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type {
    PropType,
    VNodeArrayChildren,
    VNodeChild,
} from 'vue';
import {
    computed,
    defineComponent,
    h, onMounted, onUnmounted, ref,
} from 'vue';
import { SlotName } from '../../constants';
import { injectNavigationManager } from '../../manager';
import type { NavigationItemNormalized } from '../../types';
import { buildComponentOptions } from '../../helpers';
import { VCNavItem } from '../item';

export const VCNavItems = defineComponent({
    props: {
        level: {
            type: Number,
            default: 0,
        },
        data: {
            type: Array as PropType<NavigationItemNormalized[]>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const options = buildComponentOptions();

        const manager = injectNavigationManager();
        const managerItems = ref<NavigationItemNormalized[]>([]);
        if (!props.data) {
            managerItems.value = manager.getItems(props.level);
        }

        const counter = ref(0);

        let removeListener : CallableFunction | undefined;

        onMounted(() => {
            removeListener = manager.on('tierUpdated', (tier, items) => {
                if (tier !== props.level) {
                    return;
                }

                managerItems.value = items;
                counter.value++;
            });
        });

        onUnmounted(() => {
            if (typeof removeListener === 'function') {
                removeListener();

                removeListener = undefined;
            }
        });

        const items = computed(() => {
            if (typeof props.data !== 'undefined') {
                return props.data;
            }

            return managerItems.value;
        });

        return () => {
            const vNodes : VNodeArrayChildren = [];

            for (let i = 0; i < items.value.length; i++) {
                if (!items.value[i].display && !items.value[i].displayChildren) {
                    continue;
                }

                let vNode : VNodeChild;
                if (hasNormalizedSlot(SlotName.ITEM, slots)) {
                    vNode = normalizeSlot(SlotName.ITEM, { data: items.value[i] }, slots);
                } else {
                    vNode = h(
                        VCNavItem,
                        {
                            key: `${i}:${counter.value}`,
                            data: items.value[i],
                        },
                    );
                }

                vNodes.push(vNode);
            }

            return h(options.groupTag, {
                class: props.data ?
                    options.subGroupItemsClass :
                    options.groupClass,
            }, vNodes);
        };
    },
});
