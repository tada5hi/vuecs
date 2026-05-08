import type { PropType } from 'vue';
import type { UseComponentThemeProps } from './composable';
import type {
    ThemeClasses,
    ThemeClassesOverride,
    VariantValues,
} from './types';

/**
 * Standard `themeClass` + `themeVariant` prop declarations every themable
 * component exposes. Spread into your component's props block:
 *
 * ```ts
 * const myProps = {
 *     ...themableProps<MyThemeClasses>(),
 *     rows: { type: Array, default: () => [] },
 * };
 * ```
 *
 * The generic parameter binds `themeClass`'s value to your component's
 * slot map, so consumers get autocomplete and typo detection for slot
 * keys in the override object.
 */
export function themableProps<T extends ThemeClasses>() {
    return {
        /** Theme-class overrides for this component instance. */
        themeClass: { type: Object as PropType<ThemeClassesOverride<T>>, default: undefined },
        /** Theme-variant values for this component instance. */
        themeVariant: { type: Object as PropType<VariantValues>, default: undefined },
    };
}

/**
 * Build the reactive `themeClass` / `themeVariant` getter object for
 * `useComponentTheme`. Folds shorthand variant props (e.g. `color`,
 * `size`, `density`) into the resolved `themeVariant` so consumers can
 * write either `<MyComp size="sm">` or
 * `<MyComp :theme-variant="{ size: 'sm' }">`.
 *
 * @param props The reactive `props` object from `setup(props)`. Must be
 *              the live proxy — not a destructured copy — so reactivity
 *              tracks across changes.
 * @param shorthandVariantKeys Names of consumer props to fold into
 *                             `themeVariant`. Pass them as the
 *                             `defaults.variants` keys.
 *
 * @example
 * ```ts
 * setup(props) {
 *     const theme = useComponentTheme(
 *         'badge',
 *         useThemeProps(props, 'color', 'variant', 'size'),
 *         badgeThemeDefaults,
 *     );
 * }
 * ```
 */
export function useThemeProps<T extends ThemeClasses>(
    props: UseComponentThemeProps<T> & Record<string, unknown>,
    ...shorthandVariantKeys: string[]
): UseComponentThemeProps<T> {
    return {
        get themeClass() {
            return props.themeClass;
        },
        get themeVariant() {
            const result: VariantValues = { ...(props.themeVariant ?? {}) };
            for (const key of shorthandVariantKeys) {
                const value = props[key];
                if (value !== undefined) {
                    result[key] = value as string | boolean;
                }
            }
            return result;
        },
    };
}
