import { describe, expect, it } from 'vitest';
import { useStateMachine } from '../../../src';

describe('useStateMachine', () => {
    type State = 'closed' | 'open';
    type Event = 'OPEN' | 'CLOSE' | 'TOGGLE';

    const machine = {
        closed: { OPEN: 'open', TOGGLE: 'open' },
        open: { CLOSE: 'closed', TOGGLE: 'closed' },
    } as const;

    it('initializes with the provided state', () => {
        const { state } = useStateMachine<State, Event>('closed', machine);
        expect(state.value).toBe('closed');
    });

    it('transitions on a known event', () => {
        const { state, dispatch } = useStateMachine<State, Event>('closed', machine);
        dispatch('OPEN');
        expect(state.value).toBe('open');
        dispatch('CLOSE');
        expect(state.value).toBe('closed');
    });

    it('keeps the current state on an unknown event', () => {
        const { state, dispatch } = useStateMachine<State, Event>('closed', machine);
        dispatch('CLOSE'); // not a valid transition from `closed`
        expect(state.value).toBe('closed');
    });

    it('supports toggle-style transitions', () => {
        const { state, dispatch } = useStateMachine<State, Event>('closed', machine);
        dispatch('TOGGLE');
        expect(state.value).toBe('open');
        dispatch('TOGGLE');
        expect(state.value).toBe('closed');
    });
});
