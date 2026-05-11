<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { useList } from '../../composables';
import type { ListState } from '../../composables';
import { applyAsChild } from '../../utils';
import type { ListLoadingThemeClasses } from '../../types';

const listLoadingProps = {
    tag: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListLoadingThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListLoadingProps = ExtractPublicPropTypes<typeof listLoadingProps>;

type ListLoadingSlotProps = ListState<unknown, Record<string, unknown>>;

export const listLoadingThemeDefaults: ComponentThemeDefinition<ListLoadingThemeClasses> = { classes: { root: 'vc-list-loading' } };

export default defineComponent({
    name: 'VCListLoading',
    props: listLoadingProps,
    slots: Object as SlotsType<{
        default: ListLoadingSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listLoading', props, listLoadingThemeDefaults);
        const ctx = useList('VCListLoading');

        return () => {
            // Self-condition on `busy` — Loading exists exactly while
            // the list is fetching; otherwise emit nothing.
            if (!ctx.busy.value) return null;
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
