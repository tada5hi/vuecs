<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuCheckboxItem } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCContextMenuCheckboxItem',
    inheritAttrs: false,
    props: {
        modelValue: { type: [Boolean, String] as PropType<boolean | 'indeterminate' | undefined>, default: undefined },
        disabled: { type: Boolean, default: false },
        textValue: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['update:modelValue', 'select'],
    setup(props, {
        slots, 
        emit, 
        attrs, 
    }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuCheckboxItem,
            mergeProps(attrs, {
                modelValue: props.modelValue,
                disabled: props.disabled,
                textValue: props.textValue,
                'onUpdate:modelValue': (value: boolean | 'indeterminate') => emit('update:modelValue', value),
                onSelect: (event: Event) => emit('select', event),
                class: theme.value.checkboxItem || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
