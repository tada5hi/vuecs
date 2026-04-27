<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuCheckboxItem } from 'reka-ui';
import { useComponentTheme, useForwardPropsEmits } from '@vuecs/core';
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
    setup(props, { slots, emit }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        const forwarded = useForwardPropsEmits(props, emit);
        return () => h(
            ContextMenuCheckboxItem,
            { ...forwarded.value, class: theme.value.checkboxItem || undefined },
            { default: () => slots.default?.() },
        );
    },
});
</script>
