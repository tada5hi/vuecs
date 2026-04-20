import type {
    Theme,
    ThemeClasses,
    ThemeClassesOverride,
    ThemeManagerOptions,
} from './types';
import { resolveComponentTheme } from './resolve';

export class ThemeManager {
    readonly themes: Theme[];

    readonly overrides: Theme | undefined;

    constructor(options: ThemeManagerOptions = {}) {
        this.themes = options.themes || [];
        this.overrides = options.overrides;
    }

    resolve<T extends ThemeClasses>(
        componentName: string,
        defaults: T,
        instanceThemeClass?: ThemeClassesOverride<T>,
    ): T {
        // classesMergeFn: overrides wins, then last theme with one defined
        const classesMergeFn = this.overrides?.classesMergeFn ||
            this.themes.findLast((t) => t.classesMergeFn)?.classesMergeFn;

        return resolveComponentTheme(
            componentName,
            defaults,
            this.themes,
            this.overrides?.elements,
            instanceThemeClass,
            classesMergeFn,
        );
    }
}
