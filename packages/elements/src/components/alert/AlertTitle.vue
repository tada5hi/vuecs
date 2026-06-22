<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { alertTitleThemeDefaults } from './theme';
import type { AlertTitleThemeClasses } from './types';

const alertTitleProps = {
    /**
     * HTML tag to render.
     *
     * Vuecs convention: defaults to `'h4'` (semantically-correct alert
     * heading). Override via `:as` for nested-heading hierarchies.
     */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'h4' },
    ...themableProps<AlertTitleThemeClasses>(),
};

export type AlertTitleProps = ExtractPublicPropTypes<typeof alertTitleProps>;

export default defineComponent({
    name: 'VCAlertTitle',
    inheritAttrs: false,
    props: alertTitleProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'alertTitle',
            useThemeProps(props),
            alertTitleThemeDefaults,
        );
        return () => h(
            props.as,
            mergeProps(attrs, { class: theme.value.root || undefined }),
            slots.default?.(),
        );
    },
});
</script>
