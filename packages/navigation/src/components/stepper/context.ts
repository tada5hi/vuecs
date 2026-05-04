import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { ThemeClassesOverride, VariantValues } from '@vuecs/core';
import type { StepperThemeClasses } from './types';

/**
 * Context shared from `<VCStepper>` to its descendant parts so that
 * theme-class and theme-variant values applied to the root propagate
 * automatically to indicator / title / description / separator / item /
 * trigger without the consumer having to repeat the props on every
 * child. Per-instance values on a child still win over inherited ones.
 *
 * Optional — children render bare (without inherited theme values) when
 * mounted outside `<VCStepper>` for unit tests / Storybook.
 */
export type StepperContext = {
    themeClass: () => ThemeClassesOverride<StepperThemeClasses> | undefined;
    themeVariant: () => VariantValues | undefined;
};

const STEPPER_CONTEXT_KEY: InjectionKey<StepperContext> = Symbol('vcStepperContext');

export function provideStepperContext(ctx: StepperContext): void {
    provide(STEPPER_CONTEXT_KEY, ctx);
}

export function useStepperContext(): StepperContext | null {
    return inject(STEPPER_CONTEXT_KEY, null);
}
