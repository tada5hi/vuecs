<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { alertThemeDefaults } from './theme';
import type { AlertThemeClasses } from './types';

const alertCloseProps = {
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /**
     * Force the corner-X presentation (reads the theme's `closeIcon` slot).
     * When false (default), the slot-presence heuristic decides:
     * - slotless → corner-X (`closeIcon`)
     * - slotted → labeled-button (`close`)
     *
     * Same convention as `<VCModalClose>` / `<VCPopoverClose>` / `<VCToastClose>`.
     */
    icon: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<AlertThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type AlertCloseProps = ExtractPublicPropTypes<typeof alertCloseProps>;

/**
 * Styled close button. Emits `click` — the consumer wires the click to
 * whichever ref controls Alert visibility (a `v-if` for instant unmount
 * or a `<VCCollapse v-model:open>` for an animated dismiss). Unlike
 * `<VCModalClose>` / `<VCToastClose>` — which dispatch into Reka's
 * primitive context — `<VCAlertClose>` doesn't auto-set any state. That
 * keeps Alert presentational and lets `<VCCollapse>` compositions own
 * the unmount cascade (mount-time content is needed for the height
 * animation to play).
 */
export default defineComponent({
    name: 'VCAlertClose',
    inheritAttrs: false,
    props: alertCloseProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('alert', props, alertThemeDefaults);

        return () => {
            const hasSlot = !!slots.default;
            const slotKey = props.icon || !hasSlot ? 'closeIcon' : 'close';
            // Provide a default aria-label whenever we're in icon-mode
            // (slotless OR explicit `:icon` with custom icon-only slot
            // content like an `<svg>`). In labelled-text mode the slot
            // content already serves as the accessible name.
            const ariaLabel = (attrs['aria-label'] as string | undefined) ??
                (slotKey === 'closeIcon' ? 'Close' : undefined);

            return h(
                props.as,
                mergeProps(attrs, {
                    type: props.as === 'button' ? 'button' : undefined,
                    class: theme.value[slotKey] || undefined,
                    'aria-label': ariaLabel,
                }),
                { default: () => slots.default?.() ?? '×' },
            );
        };
    },
});
</script>
