<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { AlertDialogTitle } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { alertDialogThemeDefaults } from './theme';
import type { AlertDialogThemeClasses } from './types';

const alertDialogTitleProps = {
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AlertDialogThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AlertDialogTitleProps = ExtractPublicPropTypes<typeof alertDialogTitleProps>;

export default defineComponent({
    name: 'VCAlertDialogTitle',
    props: alertDialogTitleProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('alertDialog', props, alertDialogThemeDefaults);
        return () => h(
            AlertDialogTitle,
            { class: theme.value.title || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
