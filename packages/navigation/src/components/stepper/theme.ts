import type { ComponentThemeDefinition } from '@vuecs/core';
import type { StepperThemeClasses } from './types';

export const stepperThemeDefaults: ComponentThemeDefinition<StepperThemeClasses> = {
    classes: {
        root: 'vc-stepper',
        item: 'vc-stepper-item',
        trigger: 'vc-stepper-trigger',
        indicator: 'vc-stepper-indicator',
        title: 'vc-stepper-title',
        description: 'vc-stepper-description',
        separator: 'vc-stepper-separator',
    },
};
