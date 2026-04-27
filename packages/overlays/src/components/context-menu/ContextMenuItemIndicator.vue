<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuItemIndicator } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCContextMenuItemIndicator',
    props: {
        forceMount: { type: Boolean, default: false },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuItemIndicator,
            { forceMount: props.forceMount, class: theme.value.itemIndicator || undefined },
            { default: () => slots.default?.() ?? '✓' },
        );
    },
});
</script>
