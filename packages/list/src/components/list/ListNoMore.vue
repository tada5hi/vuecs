<script lang="ts">
import { useComponentDefaults, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { injectListContextOrThrow } from './context';
import { applyAsChild } from './render-utils';
import type { ListNoMoreDefaults, ListNoMoreThemeClasses } from './types';
import type { UseListReturn } from './use-list';

const listNoMoreProps = {
    tag: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListNoMoreThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListNoMoreProps = ExtractPublicPropTypes<typeof listNoMoreProps>;

type ListNoMoreSlotProps = UseListReturn<unknown, unknown, Record<string, unknown>>;

const behavioralDefaults: ListNoMoreDefaults = { content: 'No data available...' };

export default defineComponent({
    name: 'VCListNoMore',
    props: listNoMoreProps,
    slots: Object as SlotsType<{
        default: ListNoMoreSlotProps;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listNoMore', props, { classes: { root: 'vc-list-no-more' } });
        const defaults = useComponentDefaults('listNoMore', props, behavioralDefaults);
        const ctx = injectListContextOrThrow('VCListNoMore');

        return () => {
            // Self-condition on `isEmpty` — NoMore appears only when the
            // list has settled with zero rows.
            if (!ctx.isEmpty.value) return null;
            const rootClass = theme.value.root || undefined;
            const slotChildren = slots.default?.(ctx as unknown as ListNoMoreSlotProps);
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
