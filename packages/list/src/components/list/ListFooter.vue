<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { injectListContextOrThrow } from './context';
import { applyAsChild } from './render-utils';
import type { ListFooterThemeClasses } from './types';
import type { UseListReturn } from './use-list';

const listFooterProps = {
    tag: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListFooterThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListFooterProps = ExtractPublicPropTypes<typeof listFooterProps>;

type ListFooterSlotProps = UseListReturn<unknown, unknown, Record<string, unknown>>;

export default defineComponent({
    name: 'VCListFooter',
    props: listFooterProps,
    slots: Object as SlotsType<{
        default: ListFooterSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listFooter', props, { classes: { root: 'vc-list-footer' } });
        const ctx = injectListContextOrThrow('VCListFooter');

        return () => {
            const rootClass = theme.value.root || undefined;
            const children = slots.default?.(ctx as unknown as ListFooterSlotProps);
            if (props.asChild) {
                const cloned = applyAsChild(children, { class: rootClass });
                if (cloned) return cloned;
            }
            return h(props.tag, { class: rootClass }, children);
        };
    },
});
</script>
