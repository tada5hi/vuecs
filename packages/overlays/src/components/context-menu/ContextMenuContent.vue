<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuContent, ContextMenuPortal } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuContentProps = {
    /** Skip the portal and render in-place (testing / custom mounting). Internal — never forwarded to Reka. */
    inline: { type: Boolean, default: false },
    /** Loop arrow-key focus from last item back to first. Vuecs convention: `true` (Reka default: `false`). */
    loop: { type: Boolean, default: true },
    /** Offset in pixels along the alignment axis. */
    alignOffset: { type: Number, default: 0 },
    /** Flip / shift the menu to stay inside the viewport. */
    avoidCollisions: { type: Boolean, default: true },
    /** Per-instance theme override — flat slot key map. */
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    /** Per-instance variant values. */
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuContentProps = ExtractPublicPropTypes<typeof contextMenuContentProps>;

export default defineComponent({
    name: 'VCContextMenuContent',
    inheritAttrs: false,
    props: contextMenuContentProps,
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);

        const renderContent = () => h(
            ContextMenuContent,
            mergeProps(attrs, {
                loop: props.loop,
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
            return h(ContextMenuPortal, null, { default: () => renderContent() });
        };
    },
});
</script>
