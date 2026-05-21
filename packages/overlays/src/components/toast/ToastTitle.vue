<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { ToastTitle } from 'reka-ui';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { toastTitleThemeDefaults } from './theme';
import type { ToastTitleThemeClasses } from './types';

const toastTitleProps = {
    /**
     * HTML tag to render.
     *
     * Vuecs convention: defaults to `'h3'` (Reka's `Primitive` default is
     * `'div'`). `h3` is the semantically-correct host for an in-context
     * heading within a toast — overridable via `:as`.
     */
    as: { type: [String, Object] as PropType<string | Component>, default: 'h3' },
    /** Render the consumer's slot child as the root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    ...themableProps<ToastTitleThemeClasses>(),
};

export type ToastTitleProps = ExtractPublicPropTypes<typeof toastTitleProps>;

export default defineComponent({
    name: 'VCToastTitle',
    inheritAttrs: false,
    props: toastTitleProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'toastTitle',
            useThemeProps(props),
            toastTitleThemeDefaults,
        );
        return () => h(
            ToastTitle,
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
