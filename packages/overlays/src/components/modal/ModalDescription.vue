<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DialogDescription } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { modalThemeDefaults } from './theme';
import type { ModalThemeClasses } from './types';

const modalDescriptionProps = {
    themeClass: { type: Object as PropType<ThemeClassesOverride<ModalThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ModalDescriptionProps = ExtractPublicPropTypes<typeof modalDescriptionProps>;

export default defineComponent({
    name: 'VCModalDescription',
    props: modalDescriptionProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('modal', props, modalThemeDefaults);
        return () => h(
            DialogDescription,
            { class: theme.value.description || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
