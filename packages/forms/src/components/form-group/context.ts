import type { FormGroupContext } from './types';
import type { ThemeClasses, UseComponentThemeProps } from '@vuecs/core';
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';


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
