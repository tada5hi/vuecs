<script lang="ts">
import { defineComponent, h } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuTriggerProps = {
    /** HTML tag (or component) to render as. Reka default: `'span'`. */
    as: { type: [String, Object] as PropType<string | Component>, default: 'span' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /** When true, the trigger does not open the menu on right-click / press. */
    disabled: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuTriggerProps = ExtractPublicPropTypes<typeof contextMenuTriggerProps>;

export default defineComponent({
    name: 'VCContextMenuTrigger',
    props: contextMenuTriggerProps,
    setup(props, { slots }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuTrigger,
            {
                as: props.as,
                asChild: props.asChild,
                disabled: props.disabled,
                class: theme.value.trigger || undefined,
            },
            { default: () => slots.default?.() },
        );
    },
});
</script>
