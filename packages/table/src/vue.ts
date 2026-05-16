import type VCTable from './components/Table.vue';
import type VCTableBody from './components/TableBody.vue';
import type VCTableCell from './components/TableCell.vue';
import type VCTableEmpty from './components/TableEmpty.vue';
import type VCTableFooter from './components/TableFooter.vue';
import type VCTableHeadCell from './components/TableHeadCell.vue';
import type VCTableHeader from './components/TableHeader.vue';
import type VCTableLoading from './components/TableLoading.vue';
import type VCTableRow from './components/TableRow.vue';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCTable: typeof VCTable;
        VCTableHeader: typeof VCTableHeader;
        VCTableBody: typeof VCTableBody;
        VCTableFooter: typeof VCTableFooter;
        VCTableRow: typeof VCTableRow;
        VCTableCell: typeof VCTableCell;
        VCTableHeadCell: typeof VCTableHeadCell;
        VCTableEmpty: typeof VCTableEmpty;
        VCTableLoading: typeof VCTableLoading;
    }
}
