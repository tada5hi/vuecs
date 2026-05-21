<script lang="ts">
import { defineComponent, h } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuLabel } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuLabelProps = {
    /** HTML tag (or component) to render as. Reka default: `'div'`. */
    as: { type: [String, Object] as PropType<string | Component>, default: 'div' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuLabelProps = ExtractPublicPropTypes<typeof dropdownMenuLabelProps>;

export default defineComponent({
    name: 'VCDropdownMenuLabel',
    props: dropdownMenuLabelProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuLabel,
            {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.label || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
