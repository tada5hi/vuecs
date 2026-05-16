<script lang="ts">
import { 
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
import type { TableEmptyThemeClasses } from '../types';

const tableEmptyThemeDefaults = { classes: { root: 'vc-table-empty' } };

const behavioralDefaults = {
    content: 'No results.',
    filteredContent: 'No matches.',
};

const tableEmptyProps = {
    /** Override the auto-derived `colspan`. When omitted, uses the table's resolved colspan. */
    colspan: { type: Number, default: undefined },
    /** Mark this as the empty-after-filter case (distinct copy / icon vs empty-no-data). */
    filtered: { type: Boolean, default: false },
    /** Override the rendered text. Falls back to global defaults / hardcoded. */
    content: { type: String, default: undefined },
    /** Override the rendered text for the filtered case. */
    filteredContent: { type: String, default: undefined },
    ...themableProps<TableEmptyThemeClasses>(),
};

export type TableEmptyProps = ExtractPublicPropTypes<typeof tableEmptyProps>;

export default defineComponent({
    name: 'VCTableEmpty',
    inheritAttrs: false,
    props: tableEmptyProps,
    setup(props, { attrs, slots }) {
        const ctx = useTable();
        const defaults = useComponentDefaults('tableEmpty', props, behavioralDefaults);

        const themeProps = useThemeProps(props);
        const mergedThemeProps = {
            get themeClass() { return themeProps.themeClass; },
            get themeVariant() {
                return {
                    ...(themeProps.themeVariant ?? {}),
                    filtered: props.filtered,
                };
            },
        };
        const theme = useComponentTheme('tableEmpty', mergedThemeProps, tableEmptyThemeDefaults);

        const shouldRender = computed(() => {
            // Empty band renders only when there's no data AND we're not busy
            // (busy + no-data is the loading-band's first-load case).
            if (!ctx) return true;
            return ctx.data.value.length === 0 && !ctx.busy.value;
        });

        const resolvedColspan = computed(() => props.colspan ?? ctx?.colspan.value ?? 1);

        return () => {
            if (!shouldRender.value) return null;
            const cellContent = slots.default?.() ??
                (props.filtered ? defaults.value.filteredContent : defaults.value.content);
            // ARIA live-region attributes (`role`, `aria-live`) do NOT
            // belong on `<tbody>` — they override the native `rowgroup`
            // semantics and break table-structure recognition for
            // assistive tech. The live region lives inside the `<td>`
            // as a wrapper `<div>` instead, where it announces the
            // empty-state message without corrupting the table's
            // accessibility tree.
            return h(
                'tbody',
                mergeProps(attrs, { class: theme.value.root || undefined }),
                [
                    h('tr', null, [
                        h('td', { colspan: resolvedColspan.value }, [
                            h('div', { role: 'status', 'aria-live': 'polite' }, cellContent as never),
                        ]),
                    ]),
                ],
            );
        };
    },
});
</script>
