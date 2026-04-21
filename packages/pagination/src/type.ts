import type { ThemeManagerOptions } from '@vuecs/core';

export type PaginationMeta = {
    busy?: boolean;
    total: number;
    limit: number;
    offset: number;
    page: number;
};

export type Options = ThemeManagerOptions;
