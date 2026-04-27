<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import {
    DialogContent,
    DialogOverlay,
    DialogPortal,
} from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { modalThemeDefaults } from './theme';
import type { ModalThemeClasses } from './types';

export default defineComponent({
    name: 'VCModalContent',
    props: {
        /** Render outside a `<DialogPortal>` (e.g. when consumer composes their own portal). */
        inline: { type: Boolean, default: false },
        /** Disable the overlay backdrop. */
        hideOverlay: { type: Boolean, default: false },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ModalThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
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
