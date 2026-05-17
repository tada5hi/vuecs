import type { ComponentDefaultValues, ThemeElementDefinition } from '@vuecs/core';

export type CollapseChevron = 'auto' | 'none';

export type CollapseThemeClasses = {
    /** The outer collapsible container. */
    root: string;
};

export type CollapseTriggerThemeClasses = {
    /** The clickable trigger element. */
    root: string;
    /** Auto-rendered chevron indicator when `chevron: 'auto'`. */
    chevron: string;
};

export type CollapseContentThemeClasses = {
    /** The collapsing pane element. Themes use Reka's
     *  `--reka-collapsible-content-height` for the height transition. */
    root: string;
};

export type CollapseTriggerDefaults = {
    /** Iconify name for the auto-rendered chevron indicator. */
    chevronIcon: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        collapse?: ThemeElementDefinition<CollapseThemeClasses>;
        collapseTrigger?: ThemeElementDefinition<CollapseTriggerThemeClasses>;
        collapseContent?: ThemeElementDefinition<CollapseContentThemeClasses>;
    }
    interface ComponentDefaults {
        collapseTrigger?: ComponentDefaultValues<CollapseTriggerDefaults>;
    }
}
