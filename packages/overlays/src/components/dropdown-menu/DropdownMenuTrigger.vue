<script lang="ts">
import { defineComponent, h } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuTriggerProps = {
    as: { type: String, default: 'button' },
    asChild: { type: Boolean, default: false },
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuTriggerProps = ExtractPublicPropTypes<typeof dropdownMenuTriggerProps>;

export default defineComponent({
    name: 'VCDropdownMenuTrigger',
    props: dropdownMenuTriggerProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuTrigger,
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
