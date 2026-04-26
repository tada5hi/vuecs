// @vitest-environment jsdom
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    getNextMatch,
    useTypeahead,
    wrapArray,
} from '../../../src';

describe('wrapArray', () => {
    it('reorders by start index', () => {
        expect(wrapArray(['a', 'b', 'c', 'd'], 2)).toEqual(['c', 'd', 'a', 'b']);
    });
});

describe('getNextMatch', () => {
    const values = ['Apple', 'Banana', 'Blueberry', 'Cherry'];

    it('finds the first match for a single character', () => {
        expect(getNextMatch(values, 'b')).toBe('Banana');
    });

    it('cycles forward past the current match', () => {
        expect(getNextMatch(values, 'b', 'Banana')).toBe('Blueberry');
    });

    it('wraps to the first match when no match advances past the current', () => {
        expect(getNextMatch(values, 'b', 'Blueberry')).toBe('Banana');
    });

    it('treats repeated characters as one (cycles)', () => {
        expect(getNextMatch(values, 'bb', 'Banana')).toBe('Blueberry');
    });

    it('matches multi-character searches without excluding the current', () => {
        expect(getNextMatch(values, 'Blu')).toBe('Blueberry');
    });
});

describe('useTypeahead', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    function makeItems(labels: string[]) {
        return labels.map((label) => {
            const el = document.createElement('button');
            el.textContent = label;
            document.body.appendChild(el);
            return { ref: el };
        });
    }

    it('focuses the next matching item', () => {
        const items = makeItems(['Apple', 'Banana', 'Cherry']);
        const { handleTypeaheadSearch } = useTypeahead();

        const focused = handleTypeaheadSearch('b', items);
        expect(focused).toBe(items[1].ref);
        expect(document.activeElement).toBe(items[1].ref);
    });

    it('resets the buffer after the timeout', () => {
        const items = makeItems(['Apple', 'Banana']);
        const { search, handleTypeaheadSearch } = useTypeahead();

        handleTypeaheadSearch('b', items);
        expect(search.value).toBe('b');

        vi.advanceTimersByTime(1001);
        expect(search.value).toBe('');
    });

    it('resetTypeahead clears the buffer immediately', () => {
        const items = makeItems(['Apple']);
        const {
            search, 
            handleTypeaheadSearch, 
            resetTypeahead, 
        } = useTypeahead();

        handleTypeaheadSearch('a', items);
        expect(search.value).toBe('a');

        resetTypeahead();
        expect(search.value).toBe('');
    });

    it('invokes the optional callback in lieu of focus moves', () => {
        const items = makeItems(['Apple']);
        const cb = vi.fn();
        const { handleTypeaheadSearch } = useTypeahead(cb);

        const result = handleTypeaheadSearch('a', items);
        expect(cb).toHaveBeenCalledWith('a');
        expect(result).toBeUndefined();
    });
});
