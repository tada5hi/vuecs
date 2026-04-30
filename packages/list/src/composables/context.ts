import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';
import type { ListState } from './define-list';

// Type-erased context shape. Consumers get the precisely-typed return
// back via `useList<T, Meta>()`'s explicit type parameters.
type ListContext = ListState<unknown, Record<string, unknown>>;

const LIST_CONTEXT_KEY = Symbol('VCListContext') as InjectionKey<ListContext>;

/** Called by `<VCList>` to expose its state to descendant parts. */
export function provideList(state: ListContext): void {
    provide(LIST_CONTEXT_KEY, state);
}

/**
 * Pull the active list state from the parent `<VCList>` (Pinia-style).
 * Throws when called outside a `<VCList>` — strict by design so part
 * components fail loudly on misuse rather than silently rendering wrong.
 *
 * Pass an optional `componentName` to enrich the error trace; vuecs's
 * own parts (`<VCListBody>`, `<VCListItem>`, …) supply their own
 * names for clear diagnostics.
 */
export function useList<
    T = unknown,
    Meta extends object = Record<string, unknown>,
>(componentName?: string): ListState<T, Meta> {
    const ctx = inject(LIST_CONTEXT_KEY, undefined) as
        | ListState<T, Meta> |
        undefined;
    if (!ctx) {
        throw new Error(
            componentName ?
                `[@vuecs/list] <${componentName}> must be used inside a <VCList> (or with a manually provided list context).` :
                '[@vuecs/list] useList() must be called inside a <VCList> (or with a manually provided list context).',
        );
    }
    return ctx;
}
