<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuRadioItem } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCContextMenuRadioItem',
    inheritAttrs: false,
    props: {
        value: { type: String, required: true },
        disabled: { type: Boolean, default: false },
        textValue: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    emits: ['select'],
    setup(props, {
        slots, 
        emit, 
        attrs, 
    }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuRadioItem,
            {
                ...attrs,
                value: props.value,
                disabled: props.disabled,
                textValue: props.textValue,
                onSelect: (event: Event) => emit('select', event),
                class: theme.value.radioItem || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
