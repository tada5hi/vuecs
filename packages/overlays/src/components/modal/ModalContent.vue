<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    DialogContent,
    DialogOverlay,
    DialogPortal,
} from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { modalThemeDefaults } from './theme';
import type { ModalClosePolicy, ModalThemeClasses } from './types';

const modalContentProps = {
    /** Skip the portal and render in-place (testing / custom mounting). Internal — never forwarded to Reka. */
    inline: { type: Boolean, default: false },
    /** Disable the overlay backdrop. Internal — controls our own render branch. */
    hideOverlay: { type: Boolean, default: false },
    /**
     * Which built-in dismissal interactions are honored: `'always'`
     * (Escape + outside interaction close — Reka default), `'no-escape'`,
     * `'no-outside'`, or `'never'`. Explicit triggers (`<VCModalClose>`,
     * `v-model:open` writes) always work. Internal — implemented by
     * preventing Reka's `escapeKeyDown` / `interactOutside`; the raw
     * events keep firing for advanced per-site handling.
     */
    closePolicy: { type: String as PropType<ModalClosePolicy>, default: 'always' },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ModalThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ModalContentProps = ExtractPublicPropTypes<typeof modalContentProps>;

export default defineComponent({
    name: 'VCModalContent',
    props: modalContentProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('modal', props, modalThemeDefaults);

        const renderInner = () => [
            ...(props.hideOverlay ?
                [] :
                [h(DialogOverlay, { class: theme.value.overlay || undefined })]),
            h(
                DialogContent,
                mergeProps(attrs, {
                    class: theme.value.content || undefined,
                    // Policy handlers merge WITH consumer listeners from
                    // attrs (mergeProps collects both into an array), so a
                    // per-site `@escape-key-down` still fires alongside the
                    // policy — preventDefault() is sticky either way.
                    onEscapeKeyDown: (event: Event) => {
                        if (props.closePolicy === 'no-escape' || props.closePolicy === 'never') {
                            event.preventDefault();
                        }
                    },
                    onInteractOutside: (event: Event) => {
                        if (props.closePolicy === 'no-outside' || props.closePolicy === 'never') {
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
            return h(DialogPortal, null, { default: () => renderInner() });
        };
    },
});
</script>
