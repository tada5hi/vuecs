import type { StepperContext } from './types';
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';



const STEPPER_CONTEXT_KEY: InjectionKey<StepperContext> = Symbol('vcStepperContext');

export function provideStepperContext(ctx: StepperContext): void {
    provide(STEPPER_CONTEXT_KEY, ctx);
}

export function useStepperContext(): StepperContext | null {
    return inject(STEPPER_CONTEXT_KEY, null);
}
