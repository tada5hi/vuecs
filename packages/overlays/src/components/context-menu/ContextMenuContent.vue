<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuContent, ContextMenuPortal } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCContextMenuContent',
    inheritAttrs: false,
    props: {
        inline: { type: Boolean, default: false },
        loop: { type: Boolean, default: true },
        avoidCollisions: { type: Boolean, default: true },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);

        const renderContent = () => h(
            ContextMenuContent,
            mergeProps(attrs, {
                loop: props.loop,
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
