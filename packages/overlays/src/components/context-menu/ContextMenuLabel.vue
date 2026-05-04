<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuLabel } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuLabelProps = {
    /** HTML tag (or component) to render as. Reka default: `'div'`. */
    as: { type: String, default: 'div' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuLabelProps = ExtractPublicPropTypes<typeof contextMenuLabelProps>;

export default defineComponent({
    name: 'VCContextMenuLabel',
    props: contextMenuLabelProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuLabel,
            {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.label || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
