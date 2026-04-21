import { useComponentTheme } from '@vuecs/core';
import type { PropType, SlotsType } from 'vue';
import { defineComponent, h, toRef } from 'vue';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { ListBaseSlotProps, ListLoadingThemeClasses } from '../type';

const themeDefaults = { classes: { root: 'vc-list-loading' } };

export const VCListLoading = defineComponent({
    name: 'VCListLoading',
    props: {
        tag: { type: String, default: 'div' },
        busy: { type: Boolean, default: false },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ListLoadingThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
        slotProps: { type: Object as PropType<ListBaseSlotProps<any>>, default: () => ({}) },
    },
    slots: Object as SlotsType<{
        default?: ListBaseSlotProps<any>;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listLoading', toRef(props, 'themeClass'), themeDefaults, toRef(props, 'themeVariant'));

        return () => {
            if (!props.busy) {
                return [];
            }

            const content = slots.default ? slots.default(props.slotProps) : [];

            return h(
                props.tag,
                { class: theme.value.root },
                content,
            );
        };
    },
});
