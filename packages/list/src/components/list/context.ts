import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';
import type { UseListReturn } from './use-list';

const LIST_CONTEXT_KEY = Symbol('VCListContext') as InjectionKey<UseListReturn<any, any, any>>;

/** Called by `<VCList>` to expose its state to descendant parts. */
export function provideListContext(state: UseListReturn<any, any, any>): void {
    provide(LIST_CONTEXT_KEY, state);
}

/**
 * Pulls the active list state from the parent `<VCList>`. Returns
 * `undefined` outside a `<VCList>` so part components can warn / no-op
 * gracefully (e.g. used standalone in a story / Storybook frame).
 */
export function useListContext<T = unknown, M = unknown, Extras extends object = Record<string, unknown>>():
    UseListReturn<T, M, Extras> | undefined {
    return inject(LIST_CONTEXT_KEY, undefined) as UseListReturn<T, M, Extras> | undefined;
}

export function injectListContextOrThrow<T = unknown, M = unknown, Extras extends object = Record<string, unknown>>(
    componentName: string,
): UseListReturn<T, M, Extras> {
    const ctx = useListContext<T, M, Extras>();
    if (!ctx) {
        throw new Error(
            `[@vuecs/list] <${componentName}> must be used inside a <VCList> (or with a manually provided list context).`,
        );
    }
    return ctx;
}
