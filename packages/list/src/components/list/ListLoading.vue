<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { injectListContextOrThrow } from './context';
import { applyAsChild } from './render-utils';
import type { ListLoadingThemeClasses } from './types';
import type { UseListReturn } from './use-list';

const listLoadingProps = {
    tag: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListLoadingThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListLoadingProps = ExtractPublicPropTypes<typeof listLoadingProps>;

type ListLoadingSlotProps = UseListReturn<unknown, unknown, Record<string, unknown>>;

export default defineComponent({
    name: 'VCListLoading',
    props: listLoadingProps,
    slots: Object as SlotsType<{
        default: ListLoadingSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listLoading', props, { classes: { root: 'vc-list-loading' } });
        const ctx = injectListContextOrThrow('VCListLoading');

        return () => {
            // Self-condition on `busy` — Loading exists exactly while
            // the list is fetching; otherwise emit nothing.
            if (!ctx.busy.value) return null;
            const rootClass = theme.value.root || undefined;
            const children = slots.default?.(ctx as unknown as ListLoadingSlotProps);
            if (props.asChild) {
                const cloned = applyAsChild(children, { class: rootClass });
                if (cloned) return cloned;
            }
            return h(props.tag, { class: rootClass }, children);
        };
    },
});
</script>
