import type { ComponentDefaultValues, ThemeElementDefinition } from '@vuecs/core';

// Each part owns the theme keys it uses. After the layout-slot split
// (plan 010 follow-up) every part — including `<VCListItem>` — exposes
// only `root`. Per-cluster styling lives on the new sub-components
// `<VCListItemText>` and `<VCListItemActions>`.
export type ListThemeClasses = { root: string };
export type ListHeaderThemeClasses = { root: string };
export type ListBodyThemeClasses = { root: string };
export type ListFooterThemeClasses = { root: string };
export type ListLoadingThemeClasses = { root: string };
export type ListEmptyThemeClasses = { root: string };
export type ListItemThemeClasses = { root: string };
export type ListItemTextThemeClasses = { root: string };
export type ListItemActionsThemeClasses = { root: string };

/**
 * Resolved-default shape for `<VCListEmpty>`. Mirrors the old
 * `noMoreContent` prop on `<VCListControls>`; configurable for i18n via
 * `app.use(vuecs, { defaults: { listEmpty: { content: t('list.empty') } } })`.
 */
export type ListEmptyDefaults = {
    content: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        list?: ThemeElementDefinition<ListThemeClasses>;
        listHeader?: ThemeElementDefinition<ListHeaderThemeClasses>;
        listBody?: ThemeElementDefinition<ListBodyThemeClasses>;
        listItem?: ThemeElementDefinition<ListItemThemeClasses>;
        listItemText?: ThemeElementDefinition<ListItemTextThemeClasses>;
        listItemActions?: ThemeElementDefinition<ListItemActionsThemeClasses>;
        listFooter?: ThemeElementDefinition<ListFooterThemeClasses>;
        listLoading?: ThemeElementDefinition<ListLoadingThemeClasses>;
        listEmpty?: ThemeElementDefinition<ListEmptyThemeClasses>;
    }

    interface ComponentDefaults {
        listEmpty?: ComponentDefaultValues<ListEmptyDefaults>;
    }
}
