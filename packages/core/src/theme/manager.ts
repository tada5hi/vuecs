import type { ShallowRef } from 'vue';
import { shallowRef, triggerRef } from 'vue';
import type {
    Theme,
    ThemeClasses,
    ThemeClassesOverride,
    ThemeManagerOptions,
} from './types';
import { resolveComponentTheme } from './resolve';

export class ThemeManager {
    private readonly themesRef: ShallowRef<Theme[]>;

    private readonly overridesRef: ShallowRef<Theme | undefined>;

    constructor(options: ThemeManagerOptions = {}) {
        this.themesRef = shallowRef(options.themes || []);
        this.overridesRef = shallowRef(options.overrides);
    }

    get themes(): Theme[] {
        return this.themesRef.value;
    }

    get overrides(): Theme | undefined {
        return this.overridesRef.value;
    }

    setThemes(themes: Theme[]): void {
        const isSameRef = this.themesRef.value === themes;
        this.themesRef.value = themes;
        if (isSameRef) {
            triggerRef(this.themesRef);
        }
    }

    setOverrides(overrides: Theme | undefined): void {
        const isSameRef = this.overridesRef.value === overrides;
        this.overridesRef.value = overrides;
        if (isSameRef) {
            triggerRef(this.overridesRef);
        }
    }

    resolve<T extends ThemeClasses>(
        componentName: string,
        defaults: T,
        instanceThemeClass?: ThemeClassesOverride<T>,
    ): T {
        const { themes } = this;
        const { overrides } = this;

        // classesMergeFn: overrides wins, then last theme with one defined
        const classesMergeFn = overrides?.classesMergeFn ||
            themes.findLast((t) => t.classesMergeFn)?.classesMergeFn;

        return resolveComponentTheme(
            componentName,
            defaults,
            themes,
            overrides?.elements as Record<string, ThemeClassesOverride> | undefined,
            instanceThemeClass,
            classesMergeFn,
        );
    }
}
