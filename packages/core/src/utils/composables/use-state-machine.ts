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
        if (next) {
            state.value = next;
        }
    };

    return { state, dispatch };
}
