<script lang="ts">
import {
    Teleport,
    computed,
    defineComponent,
    h,
    mergeProps,
} from 'vue';
import type { ExtractPublicPropTypes } from 'vue';
import {
    themableProps,
    useComponentDefaults,
    useComponentTheme,
    useThemeProps,
} from '@vuecs/core';
import { useTable } from '../composables/context';
import type { TableLoadingThemeClasses } from '../types';

const tableLoadingThemeDefaults = { classes: { root: 'vc-table-loading', overlay: 'vc-table-loading-overlay' } };

const behavioralDefaults = { content: 'Loading…' };

const tableLoadingProps = {
    /** Override the auto-derived `colspan` (default mode only — ignored in overlay mode). */
    colspan: { type: Number, default: undefined },
    /** Render as a positioned overlay on top of the existing `<tbody>` (refresh feedback). Default mode is a centered tbody/tr/td placeholder. */
    overlay: { type: Boolean, default: false },
    /** Override the rendered text. Falls back to global defaults. */
    content: { type: String, default: undefined },
    ...themableProps<TableLoadingThemeClasses>(),
};

export type TableLoadingProps = ExtractPublicPropTypes<typeof tableLoadingProps>;

export default defineComponent({
    name: 'VCTableLoading',
    inheritAttrs: false,
    props: tableLoadingProps,
    setup(props, { attrs, slots }) {
        const ctx = useTable();
        const defaults = useComponentDefaults('tableLoading', props, behavioralDefaults);

        const themeProps = useThemeProps(props);
        const mergedThemeProps = {
            get themeClass() { return themeProps.themeClass; },
            get themeVariant() {
                return {
                    ...(themeProps.themeVariant ?? {}),
                    overlay: props.overlay,
                };
            },
        };
        const theme = useComponentTheme('tableLoading', mergedThemeProps, tableLoadingThemeDefaults);

        const shouldRender = computed(() => {
            if (!ctx) return true;
            const busy = ctx.busy.value;
            const hasData = ctx.data.value.length > 0;
            // Default mode: render on first load (busy + no data).
            // Overlay mode: render whenever busy (refresh-on-existing-data pattern).
            return props.overlay ? busy : busy && !hasData;
        });

        const resolvedColspan = computed(() => props.colspan ?? ctx?.colspan.value ?? 1);

        return () => {
            if (!shouldRender.value) return null;
            const cellContent = slots.default?.() ?? defaults.value.content;

            if (props.overlay) {
                // Teleport the overlay into `<VCTable>`'s positioned
                // wrapper. Rendering a `<div>` directly as a child of the
                // `<table>` is invalid HTML — the parser foster-parents
                // it OUT of the table, breaking the intended absolute
                // positioning. The wrapper is a sibling-of-`<table>`
                // `<div style="position:relative">` provided by
                // `<VCTable>`. If we're rendered outside `<VCTable>` (no
                // ctx, no wrapper), fall back to rendering inline.
                const overlayNode = h(
                    'div',
                    mergeProps(attrs, {
                        class: [theme.value.root || undefined, theme.value.overlay || undefined],
                        role: 'status',
                        'aria-live': 'polite',
                        'aria-busy': 'true',
                    }),
                    cellContent as never,
                );
                if (ctx?.wrapperEl.value) {
                    return h(Teleport, { to: ctx.wrapperEl.value }, [overlayNode]);
                }
                return overlayNode;
            }

            // ARIA live-region attributes (`role`, `aria-live`,
            // `aria-busy`) do NOT belong on `<tbody>` — they override
            // the native `rowgroup` semantics and break table-structure
            // recognition for AT. Wrap the cell content in a `<div>`
            // that carries the live region instead.
            return h(
                'tbody',
                mergeProps(attrs, { class: theme.value.root || undefined }),
                [
                    h('tr', null, [
                        h('td', { colspan: resolvedColspan.value }, [
                            h(
                                'div',
                                {
                                    role: 'status',
                                    'aria-live': 'polite',
                                    'aria-busy': 'true',
                                },
                                cellContent as never,
                            ),
                        ]),
                    ]),
                ],
            );
        };
    },
});
</script>
