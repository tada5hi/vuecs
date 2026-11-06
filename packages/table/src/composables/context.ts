import type { HeadCellCountContext, TableContext, TableRowContext } from './types';
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';



const TABLE_CONTEXT_KEY: InjectionKey<TableContext<unknown>> = Symbol('vcTableContext');

export function provideTableContext<Row>(ctx: TableContext<Row>): void {
    provide(TABLE_CONTEXT_KEY, ctx as TableContext<unknown>);
}

export function useTable<Row = unknown>(): TableContext<Row> | null {
    return inject(TABLE_CONTEXT_KEY, null) as TableContext<Row> | null;
}

const TABLE_ROW_CONTEXT_KEY: InjectionKey<TableRowContext<unknown>> = Symbol('vcTableRowContext');

export function provideTableRowContext<Row>(ctx: TableRowContext<Row>): void {
    provide(TABLE_ROW_CONTEXT_KEY, ctx as TableRowContext<unknown>);
}

export function useTableRow<Row = unknown>(): TableRowContext<Row> | null {
    return inject(TABLE_ROW_CONTEXT_KEY, null) as TableRowContext<Row> | null;
}

const TABLE_HEAD_CELL_COUNT_CONTEXT_KEY: InjectionKey<HeadCellCountContext> = Symbol(
    'vcTableHeadCellCountContext',
);

export function provideHeadCellCountContext(ctx: HeadCellCountContext): void {
    provide(TABLE_HEAD_CELL_COUNT_CONTEXT_KEY, ctx);
}

export function useHeadCellCountContext(): HeadCellCountContext | null {
    return inject(TABLE_HEAD_CELL_COUNT_CONTEXT_KEY, null);
}
