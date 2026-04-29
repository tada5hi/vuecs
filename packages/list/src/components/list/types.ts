import type { ComponentDefaultValues, ThemeElementDefinition } from '@vuecs/core';

// Each part owns the theme keys it uses (Q8). Single-slot parts have only
// `root`; `<VCListItem>` carries the wrapper keys for its layout slots.
export type ListThemeClasses = { root: string };
export type ListHeaderThemeClasses = { root: string };
export type ListBodyThemeClasses = { root: string };
export type ListFooterThemeClasses = { root: string };
export type ListLoadingThemeClasses = { root: string };
export type ListNoMoreThemeClasses = { root: string };
export type ListItemThemeClasses = {
    root: string;
    textWrapper: string;
    actionsWrapper: string;
    actionsExtraWrapper: string;
};

/**
 * Resolved-default shape for `<VCListNoMore>`. Mirrors the old
 * `noMoreContent` prop on `<VCListControls>`; configurable for i18n via
 * `app.use(vuecs, { defaults: { listNoMore: { content: t('list.empty') } } })`.
 */
export type ListNoMoreDefaults = {
    content: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        list?: ThemeElementDefinition<ListThemeClasses>;
        listHeader?: ThemeElementDefinition<ListHeaderThemeClasses>;
        listBody?: ThemeElementDefinition<ListBodyThemeClasses>;
        listItem?: ThemeElementDefinition<ListItemThemeClasses>;
        listFooter?: ThemeElementDefinition<ListFooterThemeClasses>;
        listLoading?: ThemeElementDefinition<ListLoadingThemeClasses>;
        listNoMore?: ThemeElementDefinition<ListNoMoreThemeClasses>;
    }

    interface ComponentDefaults {
        listNoMore?: ComponentDefaultValues<ListNoMoreDefaults>;
    }
}
