import { ref } from 'vue';
import type { Ref } from 'vue';

export type StateMachine<S extends string, E extends string> = Record<S, Partial<Record<E, S>>>;

export function useStateMachine<S extends string, E extends string>(
    initialState: S,
    machine: StateMachine<S, E>,
): { state: Ref<S>; dispatch: (event: E) => void } {
    const state = ref(initialState) as Ref<S>;

    const dispatch = (event: E) => {
        const next = machine[state.value]?.[event];
        // `S extends string` permits empty-string states. A truthy
        // check here would silently drop `'' → ?` transitions; use an
        // explicit undefined check so unknown events stay no-ops but
        // legitimate empty-state targets transition correctly.
        if (next !== undefined) {
            state.value = next;
        }
    };

    return { state, dispatch };
}
