<script lang="ts">
import { defineComponent, h } from 'vue';
import type { 
    Component, 
    ExtractPublicPropTypes, 
    PropType, 
    SlotsType, 
} from 'vue';
import { AlertDialogAction, injectDialogRootContext } from 'reka-ui';
import { VCPrimitive, useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { alertDialogThemeDefaults } from './theme';
import type { AlertDialogActionSlotProps, AlertDialogThemeClasses } from './types';

const alertDialogActionProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /**
     * Render the slot content as the rendered element instead of wrapping it.
     * Use `as-child` with `<VCButton color="error">` for a destructive confirm
     * with the full button variant matrix.
     */
    asChild: { type: Boolean, default: false },
    /**
     * Opt out of Reka's auto-close. By default a click closes the dialog (Reka
     * `DialogClose`). When `manual`, the click no longer closes — the default
     * slot instead receives a `confirm()` trigger to close when ready,
     * enabling validate-then-confirm and async (spinner-then-close) flows.
     */
    manual: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AlertDialogThemeClasses>>, default: undefined },
    /** Per-instance variant values — e.g. `{ tone: 'error' }` colors the action. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AlertDialogActionProps = ExtractPublicPropTypes<typeof alertDialogActionProps>;

export default defineComponent({
    name: 'VCAlertDialogAction',
    props: alertDialogActionProps,
    slots: Object as SlotsType<{
        default?: (props: AlertDialogActionSlotProps) => unknown;
    }>,
    setup(props, { slots }) {
        const theme = useComponentTheme('alertDialog', props, alertDialogThemeDefaults);
        // Reka's dialog root context is the close mechanism for `manual` mode
        // (`onOpenChange(false)` works controlled + uncontrolled). Always in
        // scope — an Action only ever renders inside a dialog (the default
        // path's DialogClose injects the same context).
        const rootContext = injectDialogRootContext();
        // Exposed to the slot in both modes as a uniform "close" handle. In the
        // default mode the button already closes on click, so it's mainly of
        // use in `manual` mode (where the auto-close is suppressed).
        const confirm = () => rootContext.onOpenChange(false);
        return () => {
            if (!props.manual) {
                return h(
                    AlertDialogAction,
                    {
                        as: props.as, 
                        asChild: props.asChild, 
                        class: theme.value.action || undefined, 
                    },
                    { default: () => slots.default?.({ confirm }) },
                );
            }
            return h(
                VCPrimitive,
                {
                    as: props.as, 
                    asChild: props.asChild, 
                    class: theme.value.action || undefined, 
                },
                { default: () => slots.default?.({ confirm }) },
            );
        };
    },
});
</script>
