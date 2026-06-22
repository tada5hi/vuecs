<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { ToastAction } from 'reka-ui';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { toastActionThemeDefaults } from './theme';
import type { ToastActionThemeClasses } from './types';

const toastActionProps = {
    /**
     * Short text describing the action. Required by Reka for AT — when the
     * toast auto-dismisses, screen readers announce this label so the user
     * knows what was missed. Mirror your action button's visible label.
     */
    altText: { type: String, required: true },
    /** HTML tag to render. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    ...themableProps<ToastActionThemeClasses>(),
};

export type ToastActionProps = ExtractPublicPropTypes<typeof toastActionProps>;

export default defineComponent({
    name: 'VCToastAction',
    inheritAttrs: false,
    props: toastActionProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'toastAction',
            useThemeProps(props),
            toastActionThemeDefaults,
        );
        return () => h(
            ToastAction as never,
            mergeProps(attrs, {
                altText: props.altText,
                as: props.as,
                asChild: props.asChild,
                class: theme.value.root || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
