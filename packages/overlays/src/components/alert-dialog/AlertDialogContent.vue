<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogPortal,
} from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { alertDialogThemeDefaults } from './theme';
import type { AlertDialogThemeClasses } from './types';

const alertDialogContentProps = {
    /** Skip the portal and render in-place (testing / custom mounting). Internal — never forwarded to Reka. */
    inline: { type: Boolean, default: false },
    /** Disable the overlay backdrop. Internal — controls our own render branch. */
    hideOverlay: { type: Boolean, default: false },
    /**
     * When `true`, the Escape key no longer closes the dialog — forcing the
     * user to pick Cancel or Action. Outside-pointer interaction is *always*
     * disabled by Reka's `AlertDialog` (a confirm must not vanish on a stray
     * click), so a single boolean is enough here (no `<VCModalContent>`-style
     * 4-value `closePolicy`). Implemented by preventing Reka's `escapeKeyDown`;
     * the raw event keeps firing for advanced per-site handling.
     */
    noEscape: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AlertDialogThemeClasses>>, default: undefined },
    /** Per-instance variant values (e.g. `{ size: 'sm' }`). */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AlertDialogContentProps = ExtractPublicPropTypes<typeof alertDialogContentProps>;

export default defineComponent({
    name: 'VCAlertDialogContent',
    props: alertDialogContentProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('alertDialog', props, alertDialogThemeDefaults);

        const renderInner = () => [
            ...(props.hideOverlay ?
                [] :
                [h(AlertDialogOverlay, { class: theme.value.overlay || undefined })]),
            h(
                AlertDialogContent,
                mergeProps(attrs, {
                    class: theme.value.content || undefined,
                    // `noEscape` gate — preventDefault() on the escape event so
                    // Reka's DialogContent skips its close. mergeProps collects
                    // this alongside any consumer `@escape-key-down`, and
                    // preventDefault() is sticky either way.
                    onEscapeKeyDown: (event: Event) => {
                        if (props.noEscape) {
                            event.preventDefault();
                        }
                    },
                }),
                { default: () => slots.default?.() },
            ),
        ];

        return () => {
            if (props.inline) {
                return renderInner();
            }
            return h(AlertDialogPortal, null, { default: () => renderInner() });
        };
    },
});
</script>
