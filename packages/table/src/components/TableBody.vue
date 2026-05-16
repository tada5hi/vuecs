<script lang="ts">
import { defineComponent, h, mergeProps } from 'vue';
import type { ExtractPublicPropTypes, SlotsType } from 'vue';
import { themableProps, useComponentTheme, useThemeProps } from '@vuecs/core';
import { useTable } from '../composables/context';
import type { TableBodyRowSlotProps, TableBodyThemeClasses } from '../types';

const tableBodyThemeDefaults = { classes: { root: 'vc-table-body' } };

const tableBodyProps = { ...themableProps<TableBodyThemeClasses>() };

export type TableBodyProps = ExtractPublicPropTypes<typeof tableBodyProps>;

export default defineComponent({
    name: 'VCTableBody',
    inheritAttrs: false,
    props: tableBodyProps,
    slots: Object as SlotsType<{
        row(props: TableBodyRowSlotProps): unknown;
        default(): unknown;
    }>,
    setup(props, { attrs, slots }) {
        const theme = useComponentTheme(
            'tableBody',
            useThemeProps(props),
            tableBodyThemeDefaults,
        );
        const ctx = useTable();

        return () => {
            // Render condition: only when there's data. Empty / Loading
            // sit as siblings under `<VCTable>` and render based on their
            // own predicates — they don't share the body's `<tbody>`.
            // Decoupled per plan 028 D1 / D6.
            const data = ctx?.data.value ?? [];
            if (data.length === 0) return null;

            const rowSlot = slots.row;

            let children: unknown[];
            if (rowSlot) {
                children = data.map((row, index) => rowSlot({ row, index } as TableBodyRowSlotProps));
            } else {
                // Default slot fallback — consumers writing Shape B manual
                // markup put their `<VCTableRow>` chain directly inside.
                children = [slots.default?.() ?? null];
            }

            return h(
                'tbody',
                mergeProps(attrs, { class: theme.value.root || undefined }),
                children as never,
            );
        };
    },
});
</script>
