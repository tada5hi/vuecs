import {
    Fragment,
    createCommentVNode,
    createTextVNode,
    h,
} from 'vue';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { isMeaningfulSlotContent } from '../../../src';

describe('isMeaningfulSlotContent', () => {
    it('treats nullish / false / empty array as empty', () => {
        expect(isMeaningfulSlotContent(undefined)).toBe(false);
        expect(isMeaningfulSlotContent(null)).toBe(false);
        expect(isMeaningfulSlotContent(false)).toBe(false);
        expect(isMeaningfulSlotContent([])).toBe(false);
    });

    it('treats a bare string by trimmed length', () => {
        expect(isMeaningfulSlotContent('')).toBe(false);
        expect(isMeaningfulSlotContent('   ')).toBe(false);
        expect(isMeaningfulSlotContent('x')).toBe(true);
    });

    it('treats any number as meaningful (including 0)', () => {
        expect(isMeaningfulSlotContent(0)).toBe(true);
        expect(isMeaningfulSlotContent(5)).toBe(true);
    });

    it('ignores comment vnodes (v-if="false" anchors)', () => {
        expect(isMeaningfulSlotContent([createCommentVNode('')])).toBe(false);
        expect(isMeaningfulSlotContent(createCommentVNode('v-if'))).toBe(false);
    });

    it('classifies text vnodes by trimmed content', () => {
        expect(isMeaningfulSlotContent([createTextVNode('   ')])).toBe(false);
        expect(isMeaningfulSlotContent([createTextVNode('hi')])).toBe(true);
    });

    it('treats element / component vnodes as meaningful', () => {
        expect(isMeaningfulSlotContent([h('span', 'x')])).toBe(true);
        expect(isMeaningfulSlotContent(h('svg'))).toBe(true);
    });

    it('recurses into Fragment children', () => {
        expect(isMeaningfulSlotContent([h(Fragment, [createCommentVNode('')])])).toBe(false);
        expect(isMeaningfulSlotContent([h(Fragment, [createTextVNode('  '), createCommentVNode('')])])).toBe(false);
        expect(isMeaningfulSlotContent([h(Fragment, [h('span', 'x')])])).toBe(true);
    });

    it('returns true when any array member is meaningful', () => {
        expect(isMeaningfulSlotContent([createCommentVNode(''), h('span', 'x')])).toBe(true);
    });
});
