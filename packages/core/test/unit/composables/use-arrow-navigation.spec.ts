// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { useArrowNavigation } from '../../../src';

describe('useArrowNavigation', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    function buildList(count: number, opts: { disabledIndices?: number[] } = {}) {
        const ul = document.createElement('ul');
        const items: HTMLElement[] = [];
        for (let i = 0; i < count; i++) {
            const li = document.createElement('li');
            li.tabIndex = 0;
            li.setAttribute('data-vc-collection-item', '');
            li.textContent = `item-${i}`;
            if (opts.disabledIndices?.includes(i)) {
                li.setAttribute('disabled', '');
            }
            ul.appendChild(li);
            items.push(li);
        }
        document.body.appendChild(ul);
        return { ul, items };
    }

    function key(name: string): KeyboardEvent {
        return new KeyboardEvent('keydown', { key: name, cancelable: true });
    }

    it('moves to the next item on ArrowDown', () => {
        const { ul, items } = buildList(3);
        const result = useArrowNavigation(key('ArrowDown'), items[0], ul);
        expect(result).toBe(items[1]);
    });

    it('moves to the previous item on ArrowUp', () => {
        const { ul, items } = buildList(3);
        const result = useArrowNavigation(key('ArrowUp'), items[2], ul);
        expect(result).toBe(items[1]);
    });

    it('wraps around when loop is true (default)', () => {
        const { ul, items } = buildList(3);
        const result = useArrowNavigation(key('ArrowDown'), items[2], ul);
        expect(result).toBe(items[0]);
    });

    it('returns null at the boundary when loop is false', () => {
        const { ul, items } = buildList(3);
        const result = useArrowNavigation(key('ArrowDown'), items[2], ul, { loop: false });
        expect(result).toBeNull();
    });

    it('skips disabled items (native attribute)', () => {
        const { ul, items } = buildList(4, { disabledIndices: [1, 2] });
        const result = useArrowNavigation(key('ArrowDown'), items[0], ul);
        expect(result).toBe(items[3]);
    });

    it('skips items with aria-disabled="true"', () => {
        const { ul, items } = buildList(3);
        items[1].setAttribute('aria-disabled', 'true');
        const result = useArrowNavigation(key('ArrowDown'), items[0], ul);
        expect(result).toBe(items[2]);
    });

    it('skips items with data-disabled', () => {
        const { ul, items } = buildList(3);
        items[1].setAttribute('data-disabled', '');
        const result = useArrowNavigation(key('ArrowDown'), items[0], ul);
        expect(result).toBe(items[2]);
    });

    it('skips items with the `disabled` class', () => {
        const { ul, items } = buildList(3);
        items[1].classList.add('disabled');
        const result = useArrowNavigation(key('ArrowDown'), items[0], ul);
        expect(result).toBe(items[2]);
    });

    it('treats disabled="false" as enabled', () => {
        const { ul, items } = buildList(3);
        items[1].setAttribute('disabled', 'false');
        const result = useArrowNavigation(key('ArrowDown'), items[0], ul);
        expect(result).toBe(items[1]);
    });

    it('Home jumps to first', () => {
        const { ul, items } = buildList(3);
        const result = useArrowNavigation(key('Home'), items[2], ul);
        expect(result).toBe(items[0]);
    });

    it('End jumps to last', () => {
        const { ul, items } = buildList(3);
        const result = useArrowNavigation(key('End'), items[0], ul);
        expect(result).toBe(items[2]);
    });

    it('ignores horizontal keys when arrowKeyOptions=vertical', () => {
        const { ul, items } = buildList(3);
        const result = useArrowNavigation(key('ArrowRight'), items[0], ul, { arrowKeyOptions: 'vertical' });
        expect(result).toBeNull();
    });

    it('respects rtl direction', () => {
        const { ul, items } = buildList(3);
        const result = useArrowNavigation(key('ArrowLeft'), items[0], ul, { dir: 'rtl' });
        expect(result).toBe(items[1]);
    });

    it('focuses the matched element when focus=true', () => {
        const { ul, items } = buildList(3);
        useArrowNavigation(key('ArrowDown'), items[0], ul, { focus: true });
        expect(document.activeElement).toBe(items[1]);
    });

    it('returns null when current element is missing', () => {
        const { ul } = buildList(3);
        const result = useArrowNavigation(key('ArrowDown'), null, ul);
        expect(result).toBeNull();
    });

    it('skips ignored elements when enableIgnoredElement=true', () => {
        const input = document.createElement('input');
        document.body.appendChild(input);
        const result = useArrowNavigation(key('ArrowDown'), input, document.body, { enableIgnoredElement: true });
        expect(result).toBeNull();
    });
});
