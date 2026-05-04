<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuRadioGroup } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuRadioGroupProps = {
    /** Selected value within the group. Bind via `v-model`. */
    modelValue: { type: String, default: '' },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuRadioGroupProps = ExtractPublicPropTypes<typeof contextMenuRadioGroupProps>;

export default defineComponent({
    name: 'VCContextMenuRadioGroup',
    inheritAttrs: false,
    props: contextMenuRadioGroupProps,
    emits: ['update:modelValue'],
    setup(props, {
        slots,
        emit,
        attrs,
    }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuRadioGroup,
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
