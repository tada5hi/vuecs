<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { PropType } from 'vue';
import { ContextMenuSubTrigger } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

export default defineComponent({
    name: 'VCContextMenuSubTrigger',
    inheritAttrs: false,
    props: {
        as: { type: String, default: 'div' },
        asChild: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        textValue: { type: String, default: undefined },
        themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    },
    setup(props, { slots, attrs }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuSubTrigger,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                disabled: props.disabled,
                textValue: props.textValue,
                class: theme.value.subTrigger || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
