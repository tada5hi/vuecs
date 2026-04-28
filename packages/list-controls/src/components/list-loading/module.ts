import { useComponentTheme } from '@vuecs/core';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { defineComponent, h } from 'vue';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { ListBaseSlotProps, ListLoadingThemeClasses } from '../type';

const themeDefaults = { classes: { root: 'vc-list-loading' } };

const listLoadingProps = {
    tag: { type: String, default: 'div' },
    busy: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListLoadingThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    slotProps: { type: Object as PropType<ListBaseSlotProps<any>>, default: () => ({}) },
};

export type ListLoadingProps = ExtractPublicPropTypes<typeof listLoadingProps>;

export const VCListLoading = defineComponent({
    name: 'VCListLoading',
    props: listLoadingProps,
    slots: Object as SlotsType<{
        default?: ListBaseSlotProps<any>;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listLoading', props, themeDefaults);

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
