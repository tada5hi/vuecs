<script lang="ts">
import { 
    computed, 
    defineComponent, 
    h, 
    mergeProps, 
    toRef, 
} from 'vue';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { 
    isObject, 
    themableProps, 
    useComponentTheme, 
    useThemeProps, 
} from '@vuecs/core';
import { provideTableRowContext, useTable } from '../composables/context';
import type { TableRowThemeClasses } from '../types';
import { filterRowClickEvent } from '../utils/render-utils';

const tableRowThemeDefaults = { classes: { root: 'vc-table-row' } };

const tableRowProps = {
    /** Current row data — used to resolve `_rowVariant` / `_cellVariants` and to emit `@row-click`. */
    row: { type: null as unknown as PropType<unknown>, default: undefined },
    /** Row index — used by row keyboard navigation + focused-row tracking. */
    index: { type: Number, default: undefined },
    /** Mark the row disabled — forwarded to `themeVariant.disabled`. */
    disabled: { type: Boolean, default: undefined },
    /** Mark the row selected — forwarded to `themeVariant.selected`. */
    selected: { type: Boolean, default: undefined },
    ...themableProps<TableRowThemeClasses>(),
};

export type TableRowProps = ExtractPublicPropTypes<typeof tableRowProps>;

export default defineComponent({
    name: 'VCTableRow',
    inheritAttrs: false,
    props: tableRowProps,
    setup(props, { attrs, slots }) {
        const ctx = useTable();

        // Resolve row-meta variants from the row payload.
        const rowVariant = computed<string | null>(() => {
            if (!isObject(props.row)) return null;
            const v = (props.row as Record<string, unknown>)._rowVariant;
            return typeof v === 'string' ? v : null;
        });
        const cellVariants = computed<Record<string, string>>(() => {
            if (!isObject(props.row)) return {};
            const v = (props.row as Record<string, unknown>)._cellVariants;
            return isObject(v) ? (v as Record<string, string>) : {};
        });
        const focused = computed(() => {
            if (props.index === undefined) return false;
            return ctx?.focusedRow.value === props.index;
        });

        // Theme — fold row-meta variant + per-row flags into themeVariant
        const themeProps = useThemeProps(props, 'disabled', 'selected');
        const mergedThemeProps = {
            get themeClass() { return themeProps.themeClass; },
            get themeVariant() {
                return {
                    ...(themeProps.themeVariant ?? {}),
                    ...(rowVariant.value ? { rowVariant: rowVariant.value } : {}),
                    focused: focused.value,
                };
            },
        };
        const theme = useComponentTheme('tableRow', mergedThemeProps, tableRowThemeDefaults);

        // Provide row context for child cells (needed for cellVariants resolution).
        if (props.index !== undefined) {
            provideTableRowContext({
                row: toRef(props, 'row'),
                index: toRef(props, 'index') as unknown as import('vue').Ref<number>,
                rowVariant,
                cellVariants,
                focused,
            });
        }

        const isClickable = computed(() => ctx?.rowClickable.value && props.index !== undefined && !props.disabled);

        function onClick(event: globalThis.MouseEvent) {
            if (!isClickable.value) return;
            const rowEl = event.currentTarget as globalThis.Element | null;
            if (filterRowClickEvent(event, rowEl)) return;
            if (props.index === undefined) return;
            ctx?.setFocusedRow(props.index);
            ctx?.emitRowClick(props.row, props.index, event);
        }

        function onKeydown(event: globalThis.KeyboardEvent) {
            if (!isClickable.value || props.index === undefined) return;
            const total = ctx?.data.value.length ?? 0;
            const i = props.index;
            const move = (target: number) => {
                event.preventDefault();
                const clamped = Math.max(0, Math.min(total - 1, target));
                ctx?.setFocusedRow(clamped);
                // Focus the next/prev row's DOM element.
                const tr = event.currentTarget as globalThis.HTMLElement | null;
                if (!tr) return;
                const direction = clamped > i ? 'nextElementSibling' : 'previousElementSibling';
                let sibling: globalThis.Element | null = tr;
                const steps = Math.abs(clamped - i);
                for (let s = 0; s < steps; s += 1) {
                    sibling = sibling ? sibling[direction] : null;
                }
                if (sibling instanceof globalThis.HTMLElement) sibling.focus();
            };
            if (event.key === 'ArrowDown') {
                move(event.shiftKey ? total - 1 : i + 1);
            } else if (event.key === 'ArrowUp') {
                move(event.shiftKey ? 0 : i - 1);
            } else if (event.key === 'Home') {
                move(0);
            } else if (event.key === 'End') {
                move(total - 1);
            } else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                ctx?.emitRowClick(props.row, i, event);
            }
        }

        function onFocus() {
            if (!isClickable.value || props.index === undefined) return;
            ctx?.setFocusedRow(props.index);
        }

        return () => h(
            'tr',
            mergeProps(attrs, {
                class: theme.value.root || undefined,
                tabindex: isClickable.value ? 0 : undefined,
                'data-row-variant': rowVariant.value || undefined,
                onClick: isClickable.value ? onClick : undefined,
                onKeydown: isClickable.value ? onKeydown : undefined,
                onFocus: isClickable.value ? onFocus : undefined,
            }),
            slots.default?.(),
        );
    },
});
</script>
