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
import type { ModalThemeClasses } from './types';

const modalContentProps = {
    /** Skip the portal and render in-place (testing / custom mounting). Internal — never forwarded to Reka. */
    inline: { type: Boolean, default: false },
    /** Disable the overlay backdrop. Internal — controls our own render branch. */
    hideOverlay: { type: Boolean, default: false },
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
                mergeProps(attrs, { class: theme.value.content || undefined }),
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
