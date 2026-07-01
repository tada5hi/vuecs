<script lang="ts">
import { defineComponent, h } from 'vue';
import type { 
    Component, 
    ExtractPublicPropTypes, 
    PropType, 
    SlotsType, 
} from 'vue';
import { AlertDialogCancel, injectDialogRootContext } from 'reka-ui';
import { VCPrimitive, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { alertDialogThemeDefaults } from './theme';
import type { AlertDialogCancelSlotProps, AlertDialogThemeClasses } from './types';

const alertDialogCancelProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /**
     * Render the slot content as the rendered element instead of wrapping it.
     * Use `as-child` with `<VCButton>` to inherit the full button variant
     * matrix on the cancel action.
     */
    asChild: { type: Boolean, default: false },
    /**
     * Opt out of Reka's auto-close. By default a click closes the dialog (Reka
     * `DialogClose`). When `manual`, the click no longer closes — the default
     * slot instead receives a `cancel()` trigger to close it programmatically.
     * (In `manual` mode the Reka cancel-element auto-focus is not registered;
     * focus falls to the first focusable element.)
     */
    manual: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AlertDialogThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AlertDialogCancelProps = ExtractPublicPropTypes<typeof alertDialogCancelProps>;

export default defineComponent({
    name: 'VCAlertDialogCancel',
    props: alertDialogCancelProps,
    slots: Object as SlotsType<{
        default?: (props: AlertDialogCancelSlotProps) => unknown;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('alertDialog', props, alertDialogThemeDefaults);
        const rootContext = injectDialogRootContext();
        // Uniform "close" handle exposed to the slot; the real value is in
        // `manual` mode where the click's auto-close is suppressed.
        const cancel = () => rootContext.onOpenChange(false);
        return () => {
            if (!props.manual) {
                return h(
                    AlertDialogCancel,
                    {
                        as: props.as, 
                        asChild: props.asChild, 
                        class: theme.value.cancel || undefined, 
                    },
                    { default: () => slots.default?.({ cancel }) },
                );
            }
            return h(
                VCPrimitive,
                {
                    as: props.as, 
                    asChild: props.asChild, 
                    class: theme.value.cancel || undefined, 
                },
                { default: () => slots.default?.({ cancel }) },
            );
        };
    },
});
</script>
