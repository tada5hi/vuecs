<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { DialogTitle } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { modalThemeDefaults } from './theme';
import type { ModalThemeClasses } from './types';

export default defineComponent({
    name: 'VCModalTitle',
    props: {
        themeClass: { type: Object as PropType<ThemeClassesOverride<ModalThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots }) {
        const theme = useComponentTheme('modal', props, modalThemeDefaults);
        return () => h(
            DialogTitle,
            { class: theme.value.title || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
