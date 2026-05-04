import type { ThemeElementDefinition } from '@vuecs/core';

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
    interface ThemeElements {
        stepper?: ThemeElementDefinition<StepperThemeClasses>;
    }
}
