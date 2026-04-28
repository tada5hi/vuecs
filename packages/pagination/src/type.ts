import type { ComponentDefaultValues, CoreOptions, ThemeElementDefinition } from '@vuecs/core';

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

export type PaginationDefaults = {
    firstIcon: string;
    prevIcon: string;
    nextIcon: string;
    lastIcon: string;
    firstLabel: string;
    prevLabel: string;
    nextLabel: string;
    lastLabel: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        pagination?: ThemeElementDefinition<PaginationThemeClasses>;
    }
    interface ComponentDefaults {
        pagination?: ComponentDefaultValues<PaginationDefaults>;
    }
}

export type Options = CoreOptions;
