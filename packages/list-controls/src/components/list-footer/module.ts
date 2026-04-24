import { useComponentTheme } from '@vuecs/core';
import type { PropType, SlotsType, VNodeChild } from 'vue';
import { defineComponent, h } from 'vue';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { ListBaseSlotProps, ListFooterThemeClasses } from '../type';

const themeDefaults = { classes: { root: 'vc-list-footer' } };

export const VCListFooter = defineComponent({
    name: 'VCListFooter',
    props: {
        tag: { type: String, default: 'div' },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ListFooterThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
        slotProps: { type: Object as PropType<ListBaseSlotProps<any>>, default: () => ({}) },
    },
    slots: Object as SlotsType<{
        default?: ListBaseSlotProps<any>;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listFooter', props, themeDefaults);

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
