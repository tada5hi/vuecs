import type { CoreOptions, ThemeElementDefinition } from '@vuecs/core';

export type PaginationMeta = {
    busy?: boolean;
    total: number;
    limit: number;
    offset: number;
    page: number;
};

export type PaginationThemeClasses = {
    root: string;
    item: string;
    link: string;
    linkActive: string;
    ellipsis: string;
    prevIcon: string;
    nextIcon: string;
    firstIcon: string;
    lastIcon: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        pagination?: ThemeElementDefinition<PaginationThemeClasses>;
    }
}

export type Options = CoreOptions;
