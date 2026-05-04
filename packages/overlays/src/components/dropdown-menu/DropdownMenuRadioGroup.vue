<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuRadioGroup } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuRadioGroupProps = {
    /** Selected value within the group. Bind via `v-model`. */
    modelValue: { type: String, default: '' },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuRadioGroupProps = ExtractPublicPropTypes<typeof dropdownMenuRadioGroupProps>;

export default defineComponent({
    name: 'VCDropdownMenuRadioGroup',
    inheritAttrs: false,
    props: dropdownMenuRadioGroupProps,
    emits: ['update:modelValue'],
    setup(props, {
        slots,
        emit,
        attrs,
    }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuRadioGroup,
            mergeProps(attrs, {
                modelValue: props.modelValue,
                'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
                class: theme.value.radioGroup || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
