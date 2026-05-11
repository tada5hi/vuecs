<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { useList } from '../../composables';
import type { ListState } from '../../composables';
import { applyAsChild } from '../../utils';
import type { ListFooterThemeClasses } from '../../types';

const listFooterProps = {
    tag: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListFooterThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListFooterProps = ExtractPublicPropTypes<typeof listFooterProps>;

type ListFooterSlotProps = ListState<unknown, Record<string, unknown>>;

export const listFooterThemeDefaults: ComponentThemeDefinition<ListFooterThemeClasses> = { classes: { root: 'vc-list-footer' } };

export default defineComponent({
    name: 'VCListFooter',
    props: listFooterProps,
    slots: Object as SlotsType<{
        default: ListFooterSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listFooter', props, listFooterThemeDefaults);
        const ctx = useList('VCListFooter');

        return () => {
            const rootClass = theme.value.root || undefined;
            const children = slots.default?.(ctx);
            if (props.asChild) {
                const cloned = applyAsChild(children, { class: rootClass });
                if (cloned) return cloned;
            }
            return h(props.tag, { class: rootClass }, children);
        };
    },
});
</script>
