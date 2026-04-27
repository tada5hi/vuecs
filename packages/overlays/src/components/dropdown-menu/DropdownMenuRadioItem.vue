<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import { DropdownMenuRadioItem } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCDropdownMenuRadioItem',
    inheritAttrs: false,
    props: {
        value: { type: String, required: true },
        disabled: { type: Boolean, default: false },
        textValue: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['select'],
    setup(props, {
        slots, 
        emit, 
        attrs, 
    }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);
        return () => h(
            DropdownMenuRadioItem,
            {
                ...mergeProps(attrs, {
                    disabled: props.disabled,
                    textValue: props.textValue,
                    onSelect: (event: Event) => emit('select', event),
                    class: theme.value.radioItem || undefined,
                }),
                value: props.value,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
