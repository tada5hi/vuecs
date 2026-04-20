import type { ThemeManagerOptions } from '@vuecs/core';

export type PaginationMeta = {
    busy?: boolean;
    total: number;
    limit: number;
    offset: number;
    page: number;
};

export type PaginationMetaInput = Omit<PaginationMeta, 'page' | 'offset'> &
    Partial<Pick<PaginationMeta, 'page' | 'offset'>>;

export type Options = ThemeManagerOptions;
