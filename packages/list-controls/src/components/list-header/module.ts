import { useComponentTheme } from '@vuecs/core';
import type { PropType, SlotsType, VNodeChild } from 'vue';
import {
    defineComponent,
    h,
    toRef,
} from 'vue';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { ListBaseSlotProps, ListHeaderThemeClasses } from '../type';

const themeDefaults: ListHeaderThemeClasses = { root: 'vc-list-header' };

export const VCListHeader = defineComponent({
    name: 'VCListHeader',
    props: {
        tag: { type: String, default: 'div' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ListHeaderThemeClasses>>, default: undefined },
        slotProps: { type: Object as PropType<ListBaseSlotProps<any>>, default: () => ({}) },
    },
    slots: Object as SlotsType<{
        default?: ListBaseSlotProps<any>;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listHeader', toRef(props, 'themeClass'), themeDefaults);

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
