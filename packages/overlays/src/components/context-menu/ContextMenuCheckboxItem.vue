<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuCheckboxItem } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuCheckboxItemProps = {
    /** Checked state. Use `'indeterminate'` for tri-state. */
    modelValue: { type: [Boolean, String] as PropType<boolean | 'indeterminate'>, default: false },
    /** When true, prevents user interaction with the item. */
    disabled: { type: Boolean, default: false },
    /** Optional typeahead text override (defaults to the item's `.textContent`). */
    textValue: { type: String, default: undefined },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuCheckboxItemProps = ExtractPublicPropTypes<typeof contextMenuCheckboxItemProps>;

export default defineComponent({
    name: 'VCContextMenuCheckboxItem',
    inheritAttrs: false,
    props: contextMenuCheckboxItemProps,
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
