<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuPortal, ContextMenuSubContent } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCContextMenuSubContent',
    inheritAttrs: false,
    props: {
        inline: { type: Boolean, default: false },
        sideOffset: { type: Number, default: 0 },
        alignOffset: { type: Number, default: 0 },
        avoidCollisions: { type: Boolean, default: true },
        loop: { type: Boolean, default: true },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
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
