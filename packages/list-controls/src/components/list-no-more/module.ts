import { 
    hasOwnProperty, 
    isObject, 
    useComponentDefaults, 
    useComponentTheme, 
} from '@vuecs/core';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, h } from 'vue';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { ListBaseSlotProps, ListNoMoreDefaults, ListNoMoreThemeClasses } from '../type';

const themeDefaults = { classes: { root: 'vc-list-no-more' } };

const behavioralDefaults: ListNoMoreDefaults = { content: 'No more items available...' };

export const VCListNoMore = defineComponent({
    name: 'VCListNoMore',
    props: {
        tag: { type: String, default: 'div' },
        busy: { type: Boolean, default: false },
        total: { type: Number, default: undefined },
        meta: { type: Object, default: undefined },
        content: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ListNoMoreThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
        slotProps: { type: Object as PropType<ListBaseSlotProps<any>>, default: () => ({}) },
    },
    slots: Object as SlotsType<{
        default?: ListBaseSlotProps<any>;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listNoMore', props, themeDefaults);
        const defaults = useComponentDefaults('listNoMore', props, behavioralDefaults);

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
                [defaults.value.content];

            return h(
                props.tag,
                { class: theme.value.root },
                content,
            );
        };
    },
});
