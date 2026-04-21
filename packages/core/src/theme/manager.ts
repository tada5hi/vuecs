import type { ShallowRef } from 'vue';
import { shallowRef, triggerRef } from 'vue';
import type {
    ComponentThemeDefinition,
    Theme,
    ThemeClasses,
    ThemeClassesOverride,
    ThemeElementDefinition,
    ThemeManagerOptions,
    VariantValues,
} from './types';
import { defaultClassesMergeFn, resolveComponentTheme } from './resolve';
import { extractVariantConfig, resolveVariantClasses } from './variant';

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
        defaults: ComponentThemeDefinition<T>,
        instanceThemeClass?: ThemeClassesOverride<T>,
        variantValues?: VariantValues,
    ): T {
        const { themes } = this;
        const { overrides } = this;

        const overrideElements = overrides?.elements as Record<string, ThemeElementDefinition> | undefined;

        // classesMergeFn: overrides wins, then last theme with one defined
        let classesMergeFn = overrides?.classesMergeFn;
        if (!classesMergeFn) {
            for (let i = themes.length - 1; i >= 0; i -= 1) {
                const themeClassesMergeFn = themes[i]?.classesMergeFn;
                if (themeClassesMergeFn) {
                    classesMergeFn = themeClassesMergeFn;
                    break;
                }
            }
        }

        const result = resolveComponentTheme(
            componentName,
            defaults,
            themes,
            overrideElements,
            instanceThemeClass,
            classesMergeFn,
        );

        // Variant resolution (always run so defaultVariants apply even without explicit values)
        const variantConfig = extractVariantConfig(
            componentName,
            defaults,
            themes,
            overrideElements,
        );

        const variantClasses = resolveVariantClasses(
            variantConfig,
            variantValues ?? {},
            classesMergeFn,
        );

        const mergeFn = classesMergeFn || defaultClassesMergeFn;
        const mutableResult = result as Record<string, string>;

        const slots = Object.keys(variantClasses);
        for (const slot of slots) {
            const cls = variantClasses[slot];
            if (!cls) continue;
            mutableResult[slot] = mergeFn(mutableResult[slot] || '', cls);
        }

        return result;
    }
}
