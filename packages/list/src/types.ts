import type { ComponentDefaultValues, ThemeElementDefinition } from '@vuecs/core';

// Five theme entries (was nine). `<VCListItemText>` / `<VCListItemActions>`
// / `<VCListHeader>` / `<VCListFooter>` were deleted in plan 027 — their
// theme keys consolidated:
//   * `text` + `actions` slot keys live on `listItem` now
//   * `header` + `footer` slot keys live on `list` now
// Consumers apply these classes to their own markup (header / footer /
// inner spans). Themes still target named slot keys; the components
// just don't exist as DOM emitters anymore.

export type ListThemeClasses = {
    root: string;
    header: string;
    footer: string;
};
export type ListBodyThemeClasses = { root: string };
export type ListLoadingThemeClasses = { root: string };
export type ListEmptyThemeClasses = { root: string };
export type ListItemThemeClasses = {
    root: string;
    text: string;
    actions: string;
};

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
        listBody?: ThemeElementDefinition<ListBodyThemeClasses>;
        listItem?: ThemeElementDefinition<ListItemThemeClasses>;
        listLoading?: ThemeElementDefinition<ListLoadingThemeClasses>;
        listEmpty?: ThemeElementDefinition<ListEmptyThemeClasses>;
    }

    interface ComponentDefaults {
        listEmpty?: ComponentDefaultValues<ListEmptyDefaults>;
    }
}
