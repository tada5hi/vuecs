<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DialogTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { modalThemeDefaults } from './theme';
import type { ModalThemeClasses } from './types';

const modalTriggerProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: String, default: 'button' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ModalThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ModalTriggerProps = ExtractPublicPropTypes<typeof modalTriggerProps>;

export default defineComponent({
    name: 'VCModalTrigger',
    props: modalTriggerProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('modal', props, modalThemeDefaults);
        return () => h(
            DialogTrigger,
            {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.trigger || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
