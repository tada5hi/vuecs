<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { AlertDialogDescription } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { alertDialogThemeDefaults } from './theme';
import type { AlertDialogThemeClasses } from './types';

const alertDialogDescriptionProps = {
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AlertDialogThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AlertDialogDescriptionProps = ExtractPublicPropTypes<typeof alertDialogDescriptionProps>;

export default defineComponent({
    name: 'VCAlertDialogDescription',
    props: alertDialogDescriptionProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('alertDialog', props, alertDialogThemeDefaults);
        return () => h(
            AlertDialogDescription,
            { class: theme.value.description || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
