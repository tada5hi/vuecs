<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { PopoverTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { popoverThemeDefaults } from './theme';
import type { PopoverThemeClasses } from './types';

const popoverTriggerProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<PopoverThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type PopoverTriggerProps = ExtractPublicPropTypes<typeof popoverTriggerProps>;

export default defineComponent({
    name: 'VCPopoverTrigger',
    inheritAttrs: false,
    props: popoverTriggerProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme('popover', props, popoverThemeDefaults);
        return () => h(
            PopoverTrigger,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.trigger || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
