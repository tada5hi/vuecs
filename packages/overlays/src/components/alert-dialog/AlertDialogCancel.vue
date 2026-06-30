<script lang="ts">
import { defineComponent, h } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { AlertDialogCancel } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { alertDialogThemeDefaults } from './theme';
import type { AlertDialogThemeClasses } from './types';

const alertDialogCancelProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /**
     * Render the slot content as the rendered element instead of wrapping it.
     * Use `as-child` with `<VCButton>` to inherit the full button variant
     * matrix on the cancel action.
     */
    asChild: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AlertDialogThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AlertDialogCancelProps = ExtractPublicPropTypes<typeof alertDialogCancelProps>;

export default defineComponent({
    name: 'VCAlertDialogCancel',
    props: alertDialogCancelProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('alertDialog', props, alertDialogThemeDefaults);
        return () => h(
            AlertDialogCancel,
            {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.cancel || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
