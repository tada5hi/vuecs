import type { ThemeClasses, UseComponentThemeProps } from '@vuecs/core';
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { ValidationSeverity } from '../constants';

/**
 * Context shared from `<VCFormGroup>` to its descendant form-input
 * children (`<VCFormInput>`, `<VCFormTextarea>`, `<VCFormSelect>`, …)
 * so the resolved validation severity propagates down without the
 * consumer wiring `:theme-variant="{ severity }"` on every input.
 *
 * Children read the context and fold the inherited severity into
 * their own `themeVariant`, lighting up each theme's `severity` variant
 * (red border for `error`, amber for `warning`, green for `success`
 * once themes declare it). Per-instance values on a child still win —
 * pass `:theme-variant="{ severity: 'error' }"` to override the
 * inherited one, or `:theme-variant="{ severity: undefined }"` to
 * explicitly opt out of inheritance for a single input.
 *
 * Optional — children render with their default border when mounted
 * outside `<VCFormGroup>` (ad-hoc usage, unit tests, custom layouts).
 *
 * Nested `<VCFormGroup>`s: the inner provider wins, so an input
 * mounted inside two stacked groups sees the inner group's severity.
 *
 * The severity getter is a function (not a plain value) so reads track
 * Vue's reactive deps: when the parent's `:validation` bundle updates,
 * descendants re-render automatically through `useComponentTheme`'s
 * computed wrapper.
 */
export type FormGroupContext = {
    severity: () => `${ValidationSeverity}` | 'success' | undefined;
};

const FORM_GROUP_CONTEXT_KEY: InjectionKey<FormGroupContext> = Symbol('vcFormGroupContext');

export function provideFormGroupContext(ctx: FormGroupContext): void {
    provide(FORM_GROUP_CONTEXT_KEY, ctx);
}

export function useFormGroupContext(): FormGroupContext | null {
    return inject(FORM_GROUP_CONTEXT_KEY, null);
}

/**
 * Wrap a form-input component's props so that any inherited severity
 * from the surrounding `<VCFormGroup>` flows into `themeVariant.severity`
 * — lighting up the theme's `severity` variant on the input without
 * the consumer wiring it per-instance.
 *
 * Per-instance values win: if the caller's `themeVariant` already has
 * a `severity` key (even one set to `undefined`), the inherited value
 * is ignored. Outside a `<VCFormGroup>` the helper is a pass-through.
 *
 * Pass directly to `useComponentTheme(name, useFormInputThemeProps(props), defaults)`.
 */
export function useFormInputThemeProps<T extends ThemeClasses>(
    props: UseComponentThemeProps<T>,
): UseComponentThemeProps<T> {
    const ctx = useFormGroupContext();
    return {
        get themeClass() {
            return props.themeClass;
        },
        get themeVariant() {
            const own = props.themeVariant;
            // Per-instance severity wins. Skip inheritance entirely when
            // the consumer already set the key — even to an explicit
            // `undefined`, which is the documented "force pristine"
            // escape hatch.
            if (own && 'severity' in own) {
                return own;
            }
            const inherited = ctx?.severity();
            if (inherited === undefined) {
                return own;
            }
            return { ...(own ?? {}), severity: inherited };
        },
    };
}
