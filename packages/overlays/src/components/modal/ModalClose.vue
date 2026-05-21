<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { DialogClose } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { modalThemeDefaults } from './theme';
import type { ModalThemeClasses } from './types';

const modalCloseProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: [String, Object] as PropType<string | Component>, default: 'button' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /**
     * Force the corner-X presentation (reads the theme's `closeIcon` slot —
     * absolute positioning + sizing). When false (default), the slot-presence
     * heuristic decides: slotless renders the corner-X, slotted renders the
     * neutral `close` styling so consumer classes compose cleanly.
     *
     * Internal slot-picker — never forwarded to Reka.
     */
    icon: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ModalThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ModalCloseProps = ExtractPublicPropTypes<typeof modalCloseProps>;

export default defineComponent({
    name: 'VCModalClose',
    inheritAttrs: false,
    props: modalCloseProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('modal', props, modalThemeDefaults);
        return () => {
            // When the consumer doesn't supply slot content the rendered
            // button only contains the "×" glyph (U+00D7), which screen
            // readers announce as "multiplication sign". Provide a default
            // aria-label so the fallback is accessible out of the box;
            // consumers can still override via attrs.
            const hasSlot = !!slots.default;
            const ariaLabel = (attrs['aria-label'] as string | undefined) ??
                (hasSlot ? undefined : 'Close');
            // Slot-presence heuristic: a bare `<VCModalClose />` means
            // the consumer wants the default `×` glyph in the corner — they
            // didn't provide content because they want the icon presentation.
            // Explicit `icon` always wins; a slot with content (e.g. "Cancel")
            // implies the labelled-button presentation.
            const slotKey = props.icon || !hasSlot ? 'closeIcon' : 'close';
            return h(
                DialogClose,
                mergeProps(attrs, {
                    as: props.as,
                    asChild: props.asChild,
                    class: theme.value[slotKey] || undefined,
                    'aria-label': ariaLabel,
                }),
                { default: () => slots.default?.() ?? '×' },
            );
        };
    },
});
</script>
