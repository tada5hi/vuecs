<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuRadioItem } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuRadioItemProps = {
    /** Identifier matched against the group's `modelValue`. */
    value: { type: String, required: true },
    /** When true, prevents user interaction with the item. */
    disabled: { type: Boolean, default: false },
    /** Optional typeahead text override (defaults to the item's `.textContent`). */
    textValue: { type: String, default: undefined },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuRadioItemProps = ExtractPublicPropTypes<typeof contextMenuRadioItemProps>;

export default defineComponent({
    name: 'VCContextMenuRadioItem',
    inheritAttrs: false,
    props: contextMenuRadioItemProps,
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
