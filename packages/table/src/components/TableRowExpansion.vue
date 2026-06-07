<script lang="ts">
import {
    defineComponent,
    h,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';
import type { ExtractPublicPropTypes } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { tableRowExpansionThemeDefaults } from '../theme';
import type { TableRowExpansionThemeClasses } from '../types';

const tableRowExpansionProps = {
    /** Width of the colspanned `<td>` — comes from `<VCTable>`'s resolved colspan. */
    colspan: { type: Number, required: true },
    /** Stable id for ARIA `aria-controls` linkage from the trigger. */
    panelId: { type: String, required: true },
    /** Stable id of the trigger element — paired into `aria-labelledby` on the panel. */
    triggerId: { type: String, required: true },
    /** Whether the panel should be visible (drives `data-state` for animations). */
    open: { type: Boolean, required: true },
    ...themableProps<TableRowExpansionThemeClasses>(),
};

export type TableRowExpansionProps = ExtractPublicPropTypes<typeof tableRowExpansionProps>;

export default defineComponent({
    name: 'VCTableRowExpansion',
    inheritAttrs: false,
    props: tableRowExpansionProps,
    setup(props, { slots }) {
        const theme = useComponentTheme(
            'tableRowExpansion',
            useThemeProps(props),
            tableRowExpansionThemeDefaults,
        );

        // ResizeObserver auto-measurement (plan 038 Q4): the inner
        // `<div>` is unconstrained and serves as the measurement
        // target; the outer animated wrapper consumes the value as
        // `height` via the inline `--vc-table-row-expansion-height`
        // CSS variable. Two `<div>`s are required because the outer
        // wrapper's animated `height` would otherwise feed back into
        // the observer's measurement (the inner's `offsetHeight`
        // collapses to 0 when the parent has `height: 0`).
        const innerRef = ref<globalThis.HTMLElement | null>(null);
        const measuredHeight = ref<number | null>(null);
        let observer: globalThis.ResizeObserver | null = null;

        const measureNow = () => {
            const el = innerRef.value;
            if (!el) return;
            measuredHeight.value = el.offsetHeight;
        };

        onMounted(() => {
            // Synchronous read before the observer attaches so the
            // first paint already has a height value — without this
            // the initial open animation would resolve `height: var(...)`
            // against an unset CSS variable and skip the interpolation
            // (i.e. no visible animation on first expand).
            measureNow();

            const el = innerRef.value;
            if (!el || typeof globalThis.ResizeObserver === 'undefined') {
                return;
            }
            observer = new globalThis.ResizeObserver((entries) => {
                const entry = entries[0];
                if (!entry) return;
                // `contentRect.height` excludes inner padding/border —
                // exactly what we need for the outer animated wrapper
                // (whose `height` should match the natural content size).
                const next = entry.contentRect.height;
                if (next !== measuredHeight.value) {
                    measuredHeight.value = next;
                }
            });
            observer.observe(el);
        });

        onBeforeUnmount(() => {
            const el = innerRef.value;
            if (observer && el) observer.unobserve(el);
            observer?.disconnect();
            observer = null;
        });

        // Re-measure when `open` flips true → content inside the panel
        // may render taller than its initial `offsetHeight` if it uses
        // async hydration or transitions. The ResizeObserver catches
        // later changes, but the first paint after a re-open benefits
        // from an explicit measurement. Moved here (from a per-render
        // `nextTick` call) so we don't schedule extra microtasks on
        // every render cycle — including during SSR.
        watch(() => props.open, (open) => {
            if (open) nextTick(measureNow);
        });

        return () => {
            const { open } = props;

            const panelStyle = measuredHeight.value !== null ?
                `--vc-table-row-expansion-height: ${measuredHeight.value}px` :
                undefined;

            return h(
                'tr',
                {
                    class: theme.value.root || undefined,
                    'data-state': open ? 'open' : 'closed',
                },
                [
                    h(
                        'td',
                        {
                            colspan: props.colspan,
                            class: theme.value.cell || undefined,
                        },
                        [
                            h(
                                'div',
                                {
                                    id: props.panelId,
                                    'aria-labelledby': props.triggerId,
                                    'data-state': open ? 'open' : 'closed',
                                    class: theme.value.panel || undefined,
                                    style: panelStyle,
                                },
                                [
                                    h(
                                        'div',
                                        {
                                            ref: (el: unknown) => {
                                                innerRef.value = (el as globalThis.HTMLElement | null) ?? null;
                                            },
                                            class: theme.value.panelInner || undefined,
                                        },
                                        slots.default?.() as never,
                                    ),
                                ],
                            ),
                        ],
                    ),
                ],
            );
        };
    },
});
</script>
