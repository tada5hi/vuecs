import { useComponentTheme } from '@vuecs/core';
import type { PropType, SlotsType, VNodeChild } from 'vue';
import { defineComponent, h, toRef } from 'vue';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { ListBaseSlotProps, ListFooterThemeClasses } from '../type';

const themeDefaults: ListFooterThemeClasses = { root: 'vc-list-footer' };

export const VCListFooter = defineComponent({
    name: 'VCListFooter',
    props: {
        tag: { type: String, default: 'div' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ListFooterThemeClasses>>, default: undefined },
        slotProps: { type: Object as PropType<ListBaseSlotProps<any>>, default: () => ({}) },
    },
    slots: Object as SlotsType<{
        default?: ListBaseSlotProps<any>;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listFooter', toRef(props, 'themeClass'), themeDefaults);

        return () => {
            const content: VNodeChild[] = [];

            if (slots.default) {
                content.push(...slots.default(props.slotProps));
            }

            if (content.length === 0) {
                return [];
            }

            return h(
                props.tag,
                { class: theme.value.root },
                content,
            );
        };
    },
});
