import type { SortDescriptor, TableColumn } from '../types';

export type SortRowsOptions<Row = unknown> = {
    columns: ReadonlyArray<TableColumn<Row>>;
    sorts: ReadonlyArray<SortDescriptor>;
};
