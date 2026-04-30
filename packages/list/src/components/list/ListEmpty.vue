<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { useList } from '../../composables';
import type { ListState } from '../../composables';
import { applyAsChild } from '../../utils';
import type { ListEmptyDefaults, ListEmptyThemeClasses } from '../../types';

const listEmptyProps = {
    tag: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListEmptyThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListEmptyProps = ExtractPublicPropTypes<typeof listEmptyProps>;

type ListEmptySlotProps = ListState<unknown, Record<string, unknown>>;

const behavioralDefaults: ListEmptyDefaults = { content: 'No data available...' };

export default defineComponent({
    name: 'VCListEmpty',
    props: listEmptyProps,
    slots: Object as SlotsType<{
        default: ListEmptySlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listEmpty', props, { classes: { root: 'vc-list-empty' } });
        const defaults = useComponentDefaults('listEmpty', props, behavioralDefaults);
        const ctx = useList('VCListEmpty');

        return () => {
            // Self-condition on `isEmpty` — Empty appears only when the
            // list has settled with zero rows (`!busy && total === 0`).
            if (!ctx.isEmpty.value) return null;
            const rootClass = theme.value.root || undefined;
            const slotChildren = slots.default?.(ctx);
            // asChild can only clone vnodes — only honor it when the
            // consumer supplies a default slot. The string fallback is
            // not a vnode, so it falls through to the wrapper element.
            if (props.asChild && slotChildren) {
                const cloned = applyAsChild(slotChildren, { class: rootClass });
                if (cloned) return cloned;
            }
            const children = slotChildren ?? [defaults.value.content];
            return h(props.tag, { class: rootClass }, children);
        };
    },
});
</script>
