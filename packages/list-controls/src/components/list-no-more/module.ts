import { hasOwnProperty, isObject, useComponentTheme } from '@vuecs/core';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, h, toRef } from 'vue';
import type { ThemeClassesOverride } from '@vuecs/core';
import type { ListBaseSlotProps, ListNoMoreThemeClasses } from '../type';

const themeDefaults: ListNoMoreThemeClasses = { root: 'vc-list-no-more' };

export const VCListNoMore = defineComponent({
    name: 'VCListNoMore',
    props: {
        tag: { type: String, default: 'div' },
        busy: { type: Boolean, default: false },
        total: { type: Number, default: undefined },
        meta: { type: Object, default: undefined },
        content: { type: String, default: 'No more items available...' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ListNoMoreThemeClasses>>, default: undefined },
        slotProps: { type: Object as PropType<ListBaseSlotProps<any>>, default: () => ({}) },
    },
    slots: Object as SlotsType<{
        default?: ListBaseSlotProps<any>;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listNoMore', toRef(props, 'themeClass'), themeDefaults);

        return () => {
            if (props.busy) {
                return [];
            }

            if (typeof props.total === 'number') {
                if (props.total > 0) {
                    return [];
                }
            } else if (
                isObject(props.meta) &&
                hasOwnProperty(props.meta, 'total') &&
                typeof props.meta.total === 'number' &&
                props.meta.total > 0
            ) {
                return [];
            }

            const content = slots.default ?
                slots.default(props.slotProps) :
                [props.content];

            return h(
                props.tag,
                { class: theme.value.root },
                content,
            );
        };
    },
});
