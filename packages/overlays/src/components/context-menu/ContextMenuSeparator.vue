<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuSeparator } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuSeparatorProps = {
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuSeparatorProps = ExtractPublicPropTypes<typeof contextMenuSeparatorProps>;

export default defineComponent({
    name: 'VCContextMenuSeparator',
    props: contextMenuSeparatorProps,
    setup(props) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(ContextMenuSeparator, { class: theme.value.separator || undefined });
    },
});
</script>
