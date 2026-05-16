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
            const rowSlot = slots.row;
            const data = ctx?.data.value ?? [];

            let children: unknown[];
            if (rowSlot) {
                // Driver path — auto-iterate `<VCTable>` data. Suppress
                // the entire `<tbody>` when there's nothing to render so
                // `<VCTableEmpty>` / `<VCTableLoading>` get the spotlight
                // (decoupled render conditions per the compound layout).
                if (data.length === 0) return null;
                children = data.map((row, index) => rowSlot({ row, index } as TableBodyRowSlotProps));
            } else {
                // Manual Shape B markup — consumers writing their own
                // `<VCTableRow>` chain inside the default slot drive the
                // content directly. Render whatever they wrote, even if
                // `ctx.data` is empty (their markup might not depend on
                // it).
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
