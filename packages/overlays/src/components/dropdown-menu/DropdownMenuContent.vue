<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { DropdownMenuContent, DropdownMenuPortal } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

const dropdownMenuContentProps = {
    /** Skip the portal and render in-place (testing / custom mounting). Internal — never forwarded to Reka. */
    inline: { type: Boolean, default: false },
    /** Preferred side relative to the trigger. */
    side: { type: String as PropType<'top' | 'right' | 'bottom' | 'left'>, default: 'bottom' },
    /** Distance in pixels between trigger and menu. Vuecs convention: 4 (Reka default: 0). */
    sideOffset: { type: Number, default: 4 },
    /** Alignment along the chosen side. Vuecs convention: `'start'` (Reka default: `'center'`) so menus left-align under their trigger. */
    align: { type: String as PropType<'start' | 'center' | 'end'>, default: 'start' },
    /** Offset in pixels along the alignment axis. */
    alignOffset: { type: Number, default: 0 },
    /** Flip / shift the menu to stay inside the viewport. */
    avoidCollisions: { type: Boolean, default: true },
    /** Loop arrow-key focus from last item back to first. Vuecs convention: `true` (Reka default: `false`). */
    loop: { type: Boolean, default: true },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type DropdownMenuContentProps = ExtractPublicPropTypes<typeof dropdownMenuContentProps>;

export default defineComponent({
    name: 'VCDropdownMenuContent',
    inheritAttrs: false,
    props: dropdownMenuContentProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);

        const renderContent = () => h(
            DropdownMenuContent,
            mergeProps(attrs, {
                side: props.side,
                sideOffset: props.sideOffset,
                align: props.align,
                alignOffset: props.alignOffset,
                avoidCollisions: props.avoidCollisions,
                loop: props.loop,
                class: theme.value.content || undefined,
            }),
            { default: () => slots.default?.() },
        );

        return () => {
            if (props.inline) {
                return renderContent();
            }
            return h(DropdownMenuPortal, null, { default: () => renderContent() });
        };
    },
});
</script>
