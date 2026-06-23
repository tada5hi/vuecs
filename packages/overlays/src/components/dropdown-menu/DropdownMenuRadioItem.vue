<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuRadioItem } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuRadioItemProps = {
    /** Identifier matched against the group's `modelValue`. */
    value: { type: String, required: true },
    /** When true, prevents user interaction with the item. */
    disabled: { type: Boolean, default: false },
    /** Optional typeahead text override (defaults to the item's `.textContent`). */
    textValue: { type: String, default: undefined },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuRadioItemProps = ExtractPublicPropTypes<typeof dropdownMenuRadioItemProps>;

export default defineComponent({
    name: 'VCDropdownMenuRadioItem',
    inheritAttrs: false,
    props: dropdownMenuRadioItemProps,
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
                // `value` is `required: true`; the `!` counters the
                // separate-const props widening to `| undefined` under strict.
                value: props.value!,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
