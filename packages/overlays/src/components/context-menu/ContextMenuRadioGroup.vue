<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuRadioGroup } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCContextMenuRadioGroup',
    inheritAttrs: false,
    props: {
        modelValue: { type: String as PropType<string | undefined>, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
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
