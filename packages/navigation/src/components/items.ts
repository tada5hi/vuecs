import { hasNormalizedSlot, normalizeSlot } from '@vuecs/core';
import type {
    PropType, VNodeArrayChildren, VNodeChild,
} from 'vue';
import {
    computed,
    defineComponent,
    h, onMounted, onUnmounted, ref,
} from 'vue';
import { SlotName } from '../constants';
import { injectManager } from '../singleton';
import type { NavigationItemNormalized } from '../types';
import { VCNavItem } from './item';

export const VCNavItems = defineComponent({
    props: {
        tier: {
            type: Number,
            default: 0,
        },
        data: {
            type: Array as PropType<NavigationItemNormalized[]>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const manager = injectManager();
        const managerItems = ref<NavigationItemNormalized[]>([]);
        if (!props.data) {
            managerItems.value = manager.getItems(props.tier);
        }

        const counter = ref(0);

        let removeListener : CallableFunction | undefined;

        onMounted(() => {
            removeListener = manager.on('tierUpdated', (tier, items) => {
                if (tier !== props.tier) {
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

        const buildVNodeChild = (data: NavigationItemNormalized) : VNodeChild => {
            if (hasNormalizedSlot(SlotName.ITEM, slots)) {
                return normalizeSlot(SlotName.ITEM, { data }, slots);
            }

            return h(VCNavItem, { data });
        };

        return () => {
            const vNodes : VNodeArrayChildren = [];

            for (let i = 0; i < items.value.length; i++) {
                if (!items.value[i].display && !items.value[i].displayChildren) {
                    continue;
                }

                vNodes.push(h(
                    'li',
                    {
                        key: `${i}:${counter.value}`,
                    },
                    [
                        buildVNodeChild(items.value[i]),
                    ],
                ));
            }

            return h('ul', {
                class: 'nav-items',
            }, vNodes);
        };
    },
});
