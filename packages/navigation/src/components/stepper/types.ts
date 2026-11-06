import type { ThemeClassesOverride, ThemeElementDefinition, VariantValues  } from '@vuecs/core';

export type StepperThemeClasses = {
    /** The root list of steps. */
    root: string;
    /** Per-step wrapper. Carries `data-state` (`active|completed|inactive`). */
    item: string;
    /** Clickable trigger inside each step. */
    trigger: string;
    /** Circular indicator (shows the step number, check, or icon). */
    indicator: string;
    /** Step title text. */
    title: string;
    /** Step description text. */
    description: string;
    /** Separator line between consecutive steps. */
    separator: string;
};

declare module '@vuecs/core' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Preserve the public contract.
    interface ThemeElements {
        stepper?: ThemeElementDefinition<StepperThemeClasses>;
    }
}

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
