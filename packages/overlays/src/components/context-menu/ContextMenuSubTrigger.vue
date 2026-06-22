<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuSubTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuSubTriggerProps = {
    /** HTML tag (or component) to render as. Reka default: `'div'`. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /** When true, prevents user interaction with the sub-trigger. */
    disabled: { type: Boolean, default: false },
    /** Optional typeahead text override (defaults to the item's `.textContent`). */
    textValue: { type: String, default: undefined },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuSubTriggerProps = ExtractPublicPropTypes<typeof contextMenuSubTriggerProps>;

export default defineComponent({
    name: 'VCContextMenuSubTrigger',
    inheritAttrs: false,
    props: contextMenuSubTriggerProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuSubTrigger,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                disabled: props.disabled,
                textValue: props.textValue,
                class: theme.value.subTrigger || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
