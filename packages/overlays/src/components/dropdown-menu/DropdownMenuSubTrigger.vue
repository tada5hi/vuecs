<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuSubTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuSubTriggerProps = {
    as: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    textValue: { type: String, default: undefined },
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuSubTriggerProps = ExtractPublicPropTypes<typeof dropdownMenuSubTriggerProps>;

export default defineComponent({
    name: 'VCDropdownMenuSubTrigger',
    inheritAttrs: false,
    props: dropdownMenuSubTriggerProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuSubTrigger,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                disabled: props.disabled,
                textValue: props.textValue,
                class: theme.value.subTrigger || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
