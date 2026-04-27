<script lang="ts">
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { DropdownMenuPortal, DropdownMenuSubContent } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { dropdownMenuThemeDefaults } from './theme';
import type { DropdownMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCDropdownMenuSubContent',
    inheritAttrs: false,
    props: {
        inline: { type: Boolean, default: false },
        sideOffset: { type: Number, default: 0 },
        alignOffset: { type: Number, default: 0 },
        avoidCollisions: { type: Boolean, default: true },
        loop: { type: Boolean, default: true },
        themeClass: { type: Object as PropType<ThemeClassesOverride<DropdownMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('dropdownMenu', props, dropdownMenuThemeDefaults);

        const renderContent = () => h(
            DropdownMenuSubContent,
            {
                ...attrs,
                sideOffset: props.sideOffset,
                alignOffset: props.alignOffset,
                avoidCollisions: props.avoidCollisions,
                loop: props.loop,
                class: theme.value.subContent || undefined,
            },
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
