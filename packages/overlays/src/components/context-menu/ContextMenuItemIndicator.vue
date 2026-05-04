<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuItemIndicator } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuItemIndicatorProps = {
    /** Force the indicator to mount even when its parent is unchecked (useful for animated transitions). */
    forceMount: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuItemIndicatorProps = ExtractPublicPropTypes<typeof contextMenuItemIndicatorProps>;

export default defineComponent({
    name: 'VCContextMenuItemIndicator',
    props: contextMenuItemIndicatorProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuItemIndicator,
            {
                forceMount: props.forceMount,
                class: theme.value.itemIndicator || undefined,
            },
            { default: () => slots.default?.() ?? '✓' },
        );
    },
});
</script>
