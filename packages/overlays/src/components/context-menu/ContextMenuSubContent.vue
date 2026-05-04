<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuPortal, ContextMenuSubContent } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuSubContentProps = {
    /** Skip the portal and render in-place (testing / custom mounting). Internal — never forwarded to Reka. */
    inline: { type: Boolean, default: false },
    /** Distance in pixels between sub-trigger and sub-menu. */
    sideOffset: { type: Number, default: 0 },
    /** Offset in pixels along the alignment axis. */
    alignOffset: { type: Number, default: 0 },
    /** Flip / shift the sub-menu to stay inside the viewport. */
    avoidCollisions: { type: Boolean, default: true },
    /** Loop arrow-key focus from last item back to first. Vuecs convention: `true` (Reka default: `false`). */
    loop: { type: Boolean, default: true },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuSubContentProps = ExtractPublicPropTypes<typeof contextMenuSubContentProps>;

export default defineComponent({
    name: 'VCContextMenuSubContent',
    inheritAttrs: false,
    props: contextMenuSubContentProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);

        const renderContent = () => h(
            ContextMenuSubContent,
            mergeProps(attrs, {
                sideOffset: props.sideOffset,
                alignOffset: props.alignOffset,
                avoidCollisions: props.avoidCollisions,
                loop: props.loop,
                class: theme.value.subContent || undefined,
            }),
            { default: () => slots.default?.() },
        );

        return () => {
            if (props.inline) {
                return renderContent();
            }
            return h(ContextMenuPortal, null, { default: () => renderContent() });
        };
    },
});
</script>
