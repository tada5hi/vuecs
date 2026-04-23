import { hasNormalizedSlot, normalizeSlot, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type {
    PropType,
    SlotsType,
    VNodeArrayChildren,
    VNodeChild,
} from 'vue';
import {
    computed,
    defineComponent,
    h,
    onMounted,
    onUnmounted,
    ref,
    toRef,
} from 'vue';
import { SlotName } from '../../constants';
import { injectNavigationManager } from '../../manager';
import type { NavigationItemNormalized } from '../../types';
import type { NavigationThemeClasses } from '../../helpers/component/types';
import { VCNavItem } from '../item';
import type { NavItemsItemSlotProps } from '../type';

const themeDefaults = {
    classes: {
        group: 'vc-nav-items',
        item: 'vc-nav-item',
        itemNested: 'vc-nav-item-nested',
        separator: 'vc-nav-separator',
        link: 'vc-nav-link',
        linkRoot: 'vc-nav-link-root',
        linkIcon: 'vc-nav-link-icon',
        linkText: 'vc-nav-link-text',
    },
};

export const VCNavItems = defineComponent({
    name: 'VCNavItems',
    props: {
        level: { type: Number, default: 0 },
        data: { type: Array as PropType<NavigationItemNormalized[]>, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<NavigationThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    slots: Object as SlotsType<{
        item: NavItemsItemSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('navigation', toRef(props, 'themeClass'), themeDefaults, toRef(props, 'themeVariant'));

        const manager = injectNavigationManager();
        const managerItems = ref<NavigationItemNormalized[]>([]);
        if (!props.data) {
            managerItems.value = manager.getItems(props.level);
        }

        const counter = ref(0);

        let removeListener: CallableFunction | undefined;

        onMounted(() => {
            removeListener = manager.on(
                'levelUpdated',
                (level, items) => {
                    if (level !== props.level) {
                        return;
                    }

                    managerItems.value = items;
                    counter.value++;
                },
            );
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
            const resolved = theme.value;
            const vNodes: VNodeArrayChildren = [];

            for (let i = 0; i < items.value.length; i++) {
                if (!items.value[i].display && !items.value[i].displayChildren) {
                    continue;
                }

                let vNode: VNodeChild;
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

            return h('ul', { class: resolved.group || undefined }, vNodes);
        };
    },
});
