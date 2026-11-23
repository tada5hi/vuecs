<script lang="ts">
import {
    computed,
    defineComponent,
    h,
    mergeProps,
    resolveComponent,
} from 'vue';
import type {
    Component,
    ExtractPublicPropTypes,
    PropType,
    SlotsType,
    VNode,
} from 'vue';
import {
    isMeaningfulSlotContent,
    themableProps,
    useComponentDefaults,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { emptyStateThemeDefaults } from './theme';
import type {
    EmptyStateDefaults,
    EmptyStateSlots,
    EmptyStateThemeClasses,
    EmptyStateVariant,
} from './types';

const emptyStateProps = {
    /** Heading text. `variant="noResults"` falls back to the `noResultsTitle` default. */
    title: { type: String, default: undefined },
    /** Body text. Replaced by the `#default` slot; `variant="noResults"` falls back to the `noResultsDescription` default. */
    description: { type: String, default: undefined },
    /** Label of the built-in action button. No button renders without it (or the `#action` slot). */
    actionLabel: { type: String, default: undefined },
    /** `empty` (no records yet) or `noResults` (search / filters matched nothing). Also a theme variant. */
    variant: { type: String as PropType<EmptyStateVariant>, default: 'empty' },
    /** Iconify name for the leading icon. Rendered only when `@vuecs/icon` is registered. */
    icon: { type: String, default: undefined },
    /** Element tag or component to render as the root. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    ...themableProps<EmptyStateThemeClasses>(),
};

export type EmptyStateProps = ExtractPublicPropTypes<typeof emptyStateProps>;

const emptyStateBehavioralDefaults: EmptyStateDefaults = {
    noResultsTitle: 'No results',
    noResultsDescription: 'Try adjusting your search or filters.',
    noResultsActionLabel: 'Reset',
};

/**
 * `<VCEmptyState>` — placeholder block for an empty collection or a
 * search / filter that matched nothing. Presentational: it emits
 * `action` and the parent decides what that means (create a record,
 * reset filters). Static content, so no live-region `role`.
 */
export default defineComponent({
    name: 'VCEmptyState',
    inheritAttrs: false,
    props: emptyStateProps,
    emits: { action: () => true },
    slots: Object as SlotsType<EmptyStateSlots>,
    setup(props, {
        attrs, 
        slots, 
        emit, 
    }) {
        const themeProps = useThemeProps(props, 'variant');
        const theme = useComponentTheme('emptyState', themeProps, emptyStateThemeDefaults);
        const defaults = useComponentDefaults('emptyState', {}, emptyStateBehavioralDefaults);

        const isNoResults = computed(() => props.variant === 'noResults');
        const title = computed(() => props.title ??
            (isNoResults.value ? defaults.value.noResultsTitle : undefined));
        const description = computed(() => props.description ??
            (isNoResults.value ? defaults.value.noResultsDescription : undefined));
        const actionLabel = computed(() => props.actionLabel ??
            (isNoResults.value ? defaults.value.noResultsActionLabel : undefined));

        const action = () => emit('action');

        // Resolved once per instance; a string result means `@vuecs/icon`
        // isn't installed (same pattern as `<VCAlert>`).
        const VCIcon = resolveComponent('VCIcon');
        const hasIconComponent = typeof VCIcon !== 'string';

        return () => {
            const classes = theme.value;

            let iconNode: VNode | null = null;
            const iconSlot = slots.icon?.({ class: classes.icon });

            if (isMeaningfulSlotContent(iconSlot)) {
                iconNode = h('div', { class: classes.icon || undefined }, iconSlot);
            } else if (props.icon && hasIconComponent) {
                iconNode = h('div', { class: classes.icon || undefined, 'aria-hidden': 'true' }, [
                    h(VCIcon as Component, { name: props.icon }),
                ]);
            }

            let titleNode: VNode | null = null;
            const titleSlot = slots.title?.();

            if (isMeaningfulSlotContent(titleSlot)) {
                titleNode = h('h3', { class: classes.title || undefined }, titleSlot);
            } else if (title.value) {
                titleNode = h('h3', { class: classes.title || undefined }, title.value);
            }

            let descriptionNode: VNode | null = null;
            const defaultSlot = slots.default?.();

            if (isMeaningfulSlotContent(defaultSlot)) {
                descriptionNode = h('div', { class: classes.description || undefined }, defaultSlot);
            } else if (description.value) {
                descriptionNode = h('p', { class: classes.description || undefined }, description.value);
            }

            let actionNode: VNode | VNode[] | null = null;
            const actionSlot = slots.action?.({ class: classes.action, action });

            if (isMeaningfulSlotContent(actionSlot)) {
                actionNode = actionSlot ?? null;
            } else if (actionLabel.value) {
                actionNode = h('button', {
                    type: 'button',
                    class: classes.action || undefined,
                    onClick: action,
                }, actionLabel.value);
            }

            return h(
                props.as,
                mergeProps(attrs, { class: classes.root || undefined }),
                [iconNode, titleNode, descriptionNode, actionNode],
            );
        };
    },
});
</script>
