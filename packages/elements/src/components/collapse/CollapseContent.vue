<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes } from 'vue';
import { CollapsibleContent } from 'reka-ui';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { collapseContentThemeDefaults } from './theme';
import type { CollapseContentThemeClasses } from './types';

const collapseContentProps = {
    /**
     * Force the content to stay mounted while closed. Use when you need
     * Vue/transition-group control of the unmount cascade. Reka default: `false`.
     */
    forceMount: { type: Boolean, default: false },
    /** HTML tag to render. */
    as: { type: String, default: 'div' },
    /** Render the consumer's slot child as the pane root (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    ...themableProps<CollapseContentThemeClasses>(),
};

export type CollapseContentProps = ExtractPublicPropTypes<typeof collapseContentProps>;

export default defineComponent({
    name: 'VCCollapseContent',
    inheritAttrs: false,
    props: collapseContentProps,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'collapseContent',
            useThemeProps(props),
            collapseContentThemeDefaults,
        );

        return () => h(
            CollapsibleContent,
            mergeProps(attrs, {
                as: props.as,
                asChild: props.asChild,
                forceMount: props.forceMount || undefined,
                class: theme.value.root || undefined,
            }),
            { default: () => slots.default?.() },
        );
    },
});
</script>
