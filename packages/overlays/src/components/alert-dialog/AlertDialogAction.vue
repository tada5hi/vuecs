<script lang="ts">
import { defineComponent, h } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { AlertDialogAction } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { alertDialogThemeDefaults } from './theme';
import type { AlertDialogThemeClasses } from './types';

const alertDialogActionProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /**
     * Render the slot content as the rendered element instead of wrapping it.
     * Use `as-child` with `<VCButton color="error">` for a destructive confirm
     * with the full button variant matrix.
     */
    asChild: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AlertDialogThemeClasses>>, default: undefined },
    /** Per-instance variant values — e.g. `{ tone: 'error' }` colors the action. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AlertDialogActionProps = ExtractPublicPropTypes<typeof alertDialogActionProps>;

export default defineComponent({
    name: 'VCAlertDialogAction',
    props: alertDialogActionProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('alertDialog', props, alertDialogThemeDefaults);
        return () => h(
            AlertDialogAction,
            {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.action || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
