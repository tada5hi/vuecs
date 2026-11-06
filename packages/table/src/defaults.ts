import type {
    TableEmptyDefaults,
    TableExpandTriggerDefaults,
    TableLoadingDefaults,
    TableSortIndicatorsDefaults,
} from './types';
import type { ComponentDefaultValues } from '@vuecs/core';

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ComponentDefaults {
        tableEmpty?: ComponentDefaultValues<TableEmptyDefaults>;
        tableLoading?: ComponentDefaultValues<TableLoadingDefaults>;
        tableExpandTrigger?: ComponentDefaultValues<TableExpandTriggerDefaults>;
        tableSortIndicators?: ComponentDefaultValues<TableSortIndicatorsDefaults>;
    }
}
