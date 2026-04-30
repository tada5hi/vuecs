<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { useList } from '../../composables';
import type { ListState } from '../../composables';
import { applyAsChild } from '../../utils';
import type { ListHeaderThemeClasses } from '../../types';

const listHeaderProps = {
    tag: { type: String, default: 'div' },
    /**
     * Reka-style as-child: render by cloning the slot's first vnode
     * (merging the part's class onto it) instead of emitting a wrapper.
     * Falls back to a wrapper when the slot has 0 or 2+ meaningful
     * vnodes.
     */
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListHeaderThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListHeaderProps = ExtractPublicPropTypes<typeof listHeaderProps>;

type ListHeaderSlotProps = ListState<unknown, Record<string, unknown>>;

export default defineComponent({
    name: 'VCListHeader',
    props: listHeaderProps,
    slots: Object as SlotsType<{
        default: ListHeaderSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listHeader', props, { classes: { root: 'vc-list-header' } });
        const ctx = useList('VCListHeader');

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
