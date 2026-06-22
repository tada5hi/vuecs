<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { CollapsibleRoot } from 'reka-ui';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { collapseThemeDefaults } from './theme';
import type { CollapseThemeClasses } from './types';

const collapseProps = {
    /** Controlled open state. Leave undefined for uncontrolled (driven by `defaultOpen`). */
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    /** Initial open state when `open` is undefined. Reka default: `false`. */
    defaultOpen: { type: Boolean, default: false },
    /** Disable interaction (trigger ignores clicks; pane stays in its current state). */
    disabled: { type: Boolean, default: false },
    /**
     * Unmount the content element when closed. When `false`, the element is
     * kept in the DOM with `hidden` set — useful for preserving state inside
     * the pane (form inputs, animations) across collapse/expand cycles.
     * Reka default: `true`.
     */
    unmountOnHide: { type: Boolean, default: true },
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    ...themableProps<CollapseThemeClasses>(),
};

export type CollapseProps = ExtractPublicPropTypes<typeof collapseProps>;

export default defineComponent({
    name: 'VCCollapse',
    inheritAttrs: false,
    props: collapseProps,
    emits: ['update:open'],
    setup(props, {
        attrs, 
        slots, 
        emit, 
    }) {
        const theme = useComponentTheme(
            'collapse',
            useThemeProps(props),
            collapseThemeDefaults,
        );

        return () => h(
            CollapsibleRoot,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                open: props.open,
                defaultOpen: props.defaultOpen,
                disabled: props.disabled,
                unmountOnHide: props.unmountOnHide,
                class: theme.value.root || undefined,
                'onUpdate:open': (open: boolean) => emit('update:open', open),
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
