<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuGroup } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCContextMenuGroup',
    props: {
        themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuGroup,
            { class: theme.value.group || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
