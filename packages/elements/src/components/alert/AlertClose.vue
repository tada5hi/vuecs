<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { useAlertContext } from './context';
import { alertThemeDefaults } from './theme';
import type { AlertThemeClasses } from './types';

const alertCloseProps = {
    /** HTML tag to render. */
    as: { type: String, default: 'button' },
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

export default defineComponent({
    name: 'VCAlertClose',
    inheritAttrs: false,
    props: alertCloseProps,
    emits: ['click'],
    setup(props, {
        slots, 
        attrs, 
        emit, 
    }) {
        const theme = useComponentTheme('alert', props, alertThemeDefaults);
        const ctx = useAlertContext();

        return () => {
            const hasSlot = !!slots.default;
            const ariaLabel = (attrs['aria-label'] as string | undefined) ??
                (hasSlot ? undefined : 'Close');
            const slotKey = props.icon || !hasSlot ? 'closeIcon' : 'close';

            function onClick(event: globalThis.MouseEvent): void {
                emit('click', event);
                if (!event.defaultPrevented) ctx?.setOpen(false);
            }

            return h(
                props.as,
                mergeProps(attrs, {
                    type: props.as === 'button' ? 'button' : undefined,
                    class: theme.value[slotKey] || undefined,
                    'aria-label': ariaLabel,
                    onClick,
                }),
                { default: () => slots.default?.() ?? '×' },
            );
        };
    },
});
</script>
