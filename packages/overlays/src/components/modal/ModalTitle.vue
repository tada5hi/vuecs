<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DialogTitle } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { modalThemeDefaults } from './theme';
import type { ModalThemeClasses } from './types';

const modalTitleProps = {
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ModalThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ModalTitleProps = ExtractPublicPropTypes<typeof modalTitleProps>;

export default defineComponent({
    name: 'VCModalTitle',
    props: modalTitleProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('modal', props, modalThemeDefaults);
        return () => h(
            DialogTitle,
            { class: theme.value.title || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
