<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type { ComponentThemeDefinition, ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType, SlotsType } from 'vue';
import { applyAsChild } from '../../utils';
import type { ListItemTextThemeClasses } from '../../types';

const listItemTextProps = {
    tag: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ListItemTextThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ListItemTextProps = ExtractPublicPropTypes<typeof listItemTextProps>;

export const listItemTextThemeDefaults: ComponentThemeDefinition<ListItemTextThemeClasses> = { classes: { root: 'vc-list-item-text' } };

export default defineComponent({
    name: 'VCListItemText',
    props: listItemTextProps,
    slots: Object as SlotsType<{
        default: Record<string, never>;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('listItemText', props, listItemTextThemeDefaults);

        return () => {
            const rootClass = theme.value.root || undefined;
            const children = slots.default?.({});
            if (props.asChild) {
                const cloned = applyAsChild(children, { class: rootClass });
                if (cloned) return cloned;
            }
            return h(props.tag, { class: rootClass }, children);
        };
    },
});
</script>
