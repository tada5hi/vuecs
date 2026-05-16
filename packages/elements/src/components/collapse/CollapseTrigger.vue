<script lang="ts">
import { 
    defineComponent, 
    h, 
    mergeProps, 
    resolveComponent, 
} from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import { CollapsibleTrigger } from 'reka-ui';
import {
    themableProps,
    useComponentDefaults,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { collapseTriggerThemeDefaults } from './theme';
import type {
    CollapseChevron,
    CollapseTriggerDefaults,
    CollapseTriggerThemeClasses,
} from './types';

const collapseTriggerProps = {
    /**
     * Auto-render a rotating chevron next to the consumer's trigger content
     * (`'auto'`, default) or render plain trigger content only (`'none'`).
     * The chevron icon name comes from `ComponentDefaults['collapseTrigger'].chevronIcon`
     * — usually wired by an icon preset (`@vuecs/icons-lucide` ships
     * `'lucide:chevron-down'`).
     */
    chevron: { type: String as PropType<CollapseChevron>, default: undefined },
    /** HTML tag (or component) to render as. Reka default: `'button'`. */
    as: { type: String, default: 'button' },
    /** Render the consumer's slot child as the trigger (Reka `asChild` pattern). */
    asChild: { type: Boolean, default: false },
    ...themableProps<CollapseTriggerThemeClasses>(),
};

export type CollapseTriggerProps = ExtractPublicPropTypes<typeof collapseTriggerProps>;

const collapseTriggerBehavioralDefaults: CollapseTriggerDefaults = { chevronIcon: '' };

export default defineComponent({
    name: 'VCCollapseTrigger',
    inheritAttrs: false,
    props: collapseTriggerProps,
    setup(props, { attrs, slots }) {
        const themeProps = useThemeProps(props, 'chevron');
        const theme = useComponentTheme('collapseTrigger', themeProps, collapseTriggerThemeDefaults);
        const defaults = useComponentDefaults('collapseTrigger', {}, collapseTriggerBehavioralDefaults);

        // Hoisted out of the render fn — resolves once per component
        // instance. `@vuecs/icon` is an optional peer; when not
        // installed, `resolveComponent` returns the lookup string
        // ('VCIcon'), so we cache the boolean check too.
        const VCIcon = resolveComponent('VCIcon');
        const hasIconComponent = typeof VCIcon !== 'string';

        return () => {
            const chevron = props.chevron ?? 'auto';
            const { chevronIcon } = defaults.value;
            // Skip the auto-chevron when `asChild` is set: Reka's asChild
            // merges trigger behavior onto the slot's *first* child only.
            // An auto-injected chevron would render as a sibling of that
            // child — outside the interactive element, breaking layout
            // and ARIA semantics. Consumers using `asChild` are expected
            // to render their own icon inside the custom child.
            const showChevron = !props.asChild &&
                chevron === 'auto' &&
                !!chevronIcon &&
                hasIconComponent;

            return h(
                CollapsibleTrigger,
                mergeProps(attrs, {
                    as: props.as,
                    asChild: props.asChild,
                    class: theme.value.root || undefined,
                }),
                {
                    default: () => [
                        slots.default?.(),
                        showChevron ? h(VCIcon as Component, {
                            name: chevronIcon,
                            class: theme.value.chevron || undefined,
                            'aria-hidden': 'true',
                        }) : null,
                    ],
                },
            );
        };
    },
});
</script>
