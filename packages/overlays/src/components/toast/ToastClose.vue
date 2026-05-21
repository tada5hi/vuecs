<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { ToastClose } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { toastThemeDefaults } from './theme';
import type { ToastThemeClasses } from './types';

const toastCloseProps = {
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: [String, Object] as PropType<string | Component>, default: 'button' },
    /** Render the slot content as the rendered element instead of wrapping it. */
    asChild: { type: Boolean, default: false },
    /**
     * Force the corner-X presentation (reads the theme's `closeIcon` slot).
     * When false (default), the slot-presence heuristic decides:
     * - slotless renders the corner-X (`closeIcon`)
     * - slotted renders the neutral `close` styling
     *
     * Same convention as `<VCModalClose>` / `<VCPopoverClose>`.
     */
    icon: { type: Boolean, default: false },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ToastThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ToastCloseProps = ExtractPublicPropTypes<typeof toastCloseProps>;

export default defineComponent({
    name: 'VCToastClose',
    inheritAttrs: false,
    props: toastCloseProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('toast', props, toastThemeDefaults);
        return () => {
            const hasSlot = !!slots.default;
            const ariaLabel = (attrs['aria-label'] as string | undefined) ??
                (hasSlot ? undefined : 'Close');
            const slotKey = props.icon || !hasSlot ? 'closeIcon' : 'close';
            return h(
                ToastClose,
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
