<script lang="ts">
import {
    defineComponent,
    h,
    mergeProps,
    resolveComponent,
} from 'vue';
import type { Component, ExtractPublicPropTypes, PropType } from 'vue';
import {
    themableProps,
    useComponentDefaults,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { useTableRow } from '../composables/context';
import { tableExpandTriggerThemeDefaults } from '../theme';
import type {
    TableExpandTriggerDefaults,
} from '../defaults';
import type { TableExpandTriggerThemeClasses } from '../types';

const tableExpandTriggerProps = {
    /**
     * Auto-render a rotating chevron next to the trigger content
     * (`'auto'`, default) or render plain trigger content only
     * (`'none'`). The chevron icon name comes from
     * `ComponentDefaults['tableExpandTrigger'].chevronIcon` — usually
     * wired by an icon preset (`@vuecs/icons-lucide` ships
     * `'lucide:chevron-down'`).
     */
    chevron: { type: String as PropType<'auto' | 'none'>, default: undefined },
    /** HTML tag (or component) to render as. Default: `'button'`. */
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'button' },
    ...themableProps<TableExpandTriggerThemeClasses>(),
};

export type TableExpandTriggerProps = ExtractPublicPropTypes<typeof tableExpandTriggerProps>;

const tableExpandTriggerBehavioralDefaults: TableExpandTriggerDefaults = {
    expandLabel: 'Expand row details',
    collapseLabel: 'Collapse row details',
    chevronIcon: '',
};

export default defineComponent({
    name: 'VCTableExpandTrigger',
    inheritAttrs: false,
    props: tableExpandTriggerProps,
    setup(props, { attrs, slots }) {
        const themeProps = useThemeProps(props, 'chevron');
        const theme = useComponentTheme('tableExpandTrigger', themeProps, tableExpandTriggerThemeDefaults);
        const defaults = useComponentDefaults('tableExpandTrigger', {}, tableExpandTriggerBehavioralDefaults);

        const VCIcon = resolveComponent('VCIcon');
        const hasIconComponent = typeof VCIcon !== 'string';

        // `useTableRow()` uses `inject()`, which must run during setup.
        // Capturing the (stable) reference here also avoids re-injecting
        // on every render. The `expansion.open` ref inside is what's
        // reactive — the outer record never changes.
        const rowCtx = useTableRow();
        const expansion = rowCtx?.expansion ?? null;

        if (!expansion) {
            if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn('[VCTableExpandTrigger] mounted outside an expandable <VCTableRow>. Set `expandable` on the row (or `:expandable` on <VCTable>).');
            }
            return () => null;
        }

        return () => {
            const open = expansion.open.value;
            const chevron = props.chevron ?? 'auto';
            const { chevronIcon } = defaults.value;
            const hasSlot = !!slots.default;
            const showChevron = chevron === 'auto' && !!chevronIcon && hasIconComponent;

            let ariaLabel: string | undefined;
            if (!hasSlot) {
                ariaLabel = open ? defaults.value.collapseLabel : defaults.value.expandLabel;
            }

            return h(
                props.as,
                mergeProps(attrs, {
                    type: props.as === 'button' ? 'button' : undefined,
                    id: expansion.triggerId,
                    'aria-expanded': open ? 'true' : 'false',
                    'aria-controls': expansion.panelId,
                    'aria-label': ariaLabel,
                    'data-state': open ? 'open' : 'closed',
                    class: theme.value.root || undefined,
                    onClick: (event: globalThis.MouseEvent) => {
                        // Stop propagation so the row's onClick handler
                        // doesn't also fire (would toggle selection /
                        // emit @row-click on the host table). The
                        // `filterRowClickEvent` helper already skips
                        // `<button>`-originated clicks, but
                        // stopPropagation is the belt-and-braces guard
                        // for custom `:as` values (e.g. `<a>`).
                        event.stopPropagation();
                        expansion.toggle();
                    },
                }),
                [
                    slots.default?.(),
                    showChevron ? h(VCIcon as Component, {
                        name: chevronIcon,
                        class: theme.value.icon || undefined,
                        'aria-hidden': 'true',
                    }) : null,
                ],
            );
        };
    },
});
</script>
