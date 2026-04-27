<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import { PopoverContent, PopoverPortal } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { popoverThemeDefaults } from './theme';
import type { PopoverThemeClasses } from './types';

export default defineComponent({
    name: 'VCPopoverContent',
    inheritAttrs: false,
    props: {
        /** Render outside `<PopoverPortal>` (testing / custom portal). */
        inline: { type: Boolean, default: false },
        side: { type: String as PropType<'top' | 'right' | 'bottom' | 'left'>, default: 'bottom' },
        sideOffset: { type: Number, default: 4 },
        align: { type: String as PropType<'start' | 'center' | 'end'>, default: 'center' },
        alignOffset: { type: Number, default: 0 },
        avoidCollisions: { type: Boolean, default: true },
        themeClass: { type: Object as PropType<ThemeClassesOverride<PopoverThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('popover', props, popoverThemeDefaults);

        const renderContent = () => h(
            PopoverContent,
            mergeProps(attrs, {
                side: props.side,
                sideOffset: props.sideOffset,
                align: props.align,
                alignOffset: props.alignOffset,
                avoidCollisions: props.avoidCollisions,
                class: theme.value.content || undefined,
            }),
            { default: () => slots.default?.() },
        );

        return () => {
            if (props.inline) {
                return renderContent();
            }
            return h(PopoverPortal, null, { default: () => renderContent() });
        };
    },
});
</script>
