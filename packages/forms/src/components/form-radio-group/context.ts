import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { FormRadioGroupContext } from './types';

const FORM_RADIO_GROUP_CONTEXT_KEY: InjectionKey<FormRadioGroupContext> = Symbol('vcFormRadioGroupContext');

export function provideFormRadioGroupContext(ctx: FormRadioGroupContext): void {
    provide(FORM_RADIO_GROUP_CONTEXT_KEY, ctx);
}

/**
 * Read the surrounding `<VCFormRadioGroup>` context; `undefined` when the
 * radio is mounted outside a group.
 */
export function injectFormRadioGroupContext(): FormRadioGroupContext | undefined {
    return inject(FORM_RADIO_GROUP_CONTEXT_KEY, undefined);
}
