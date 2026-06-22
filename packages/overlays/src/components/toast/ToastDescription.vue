<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { ToastDescription } from 'reka-ui';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { toastDescriptionThemeDefaults } from './theme';
import type { ToastDescriptionThemeClasses } from './types';

const toastDescriptionProps = {
    /**
     * HTML tag to render.
     *
     * Vuecs convention: defaults to `'p'` (Reka's `Primitive` default is
     * `'div'`). `p` is the semantically-correct host for the toast body
     * text — overridable via `:as`.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'p' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    ...themableProps<ToastDescriptionThemeClasses>(),
};

export type ToastDescriptionProps = ExtractPublicPropTypes<typeof toastDescriptionProps>;

export default defineComponent({
    name: 'VCToastDescription',
    inheritAttrs: false,
    props: toastDescriptionProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'toastDescription',
            useThemeProps(props),
            toastDescriptionThemeDefaults,
        );
        return () => h(
            ToastDescription,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                class: theme.value.root || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
