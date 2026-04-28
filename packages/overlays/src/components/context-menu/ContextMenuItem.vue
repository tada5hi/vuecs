<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { ContextMenuItem } from 'reka-ui';
import { useComponentTheme } from '@vuecs/core';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import { contextMenuThemeDefaults } from './theme';
import type { ContextMenuThemeClasses } from './types';

const contextMenuItemProps = {
    as: { type: String, default: 'div' },
    asChild: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    textValue: { type: String, default: undefined },
    themeClass: { type: Object as PropType<ThemeClassesOverride<ContextMenuThemeClasses>>, default: undefined },
    themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
};

export type ContextMenuItemProps = ExtractPublicPropTypes<typeof contextMenuItemProps>;

export default defineComponent({
    name: 'VCContextMenuItem',
    inheritAttrs: false,
    props: contextMenuItemProps,
    emits: ['select'],
    setup(props, {
        slots, 
        emit, 
        attrs, 
    }) {
        const theme = useComponentTheme('contextMenu', props, contextMenuThemeDefaults);
        return () => h(
            ContextMenuItem,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                disabled: props.disabled,
                textValue: props.textValue,
                onSelect: (event: Event) => emit('select', event),
                class: theme.value.item || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
