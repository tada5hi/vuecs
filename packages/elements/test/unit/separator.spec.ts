// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, { VCSeparator } from '../../src';

function build(props: Record<string, unknown> = {}) {
    const App = defineComponent({
        setup() {
            return () => h(VCSeparator, props);
        },
    });
    return mount(App, { global: { plugins: [[vuecsElements, {}]] } });
}

describe('<VCSeparator>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders horizontally by default with role=none (decorative)', () => {
        const wrapper = build();
        const root = wrapper.element as HTMLElement;
        expect(root.dataset.orientation).toBe('horizontal');
        // Reka encodes decorative as role="none"; non-decorative as role="separator".
        expect(root.getAttribute('role')).toBe('none');
        expect(root.classList.contains('vc-separator')).toBe(true);
    });

    it('exposes role=separator when not decorative', () => {
        const wrapper = build({ decorative: false, orientation: 'vertical' });
        const root = wrapper.element as HTMLElement;
        expect(root.getAttribute('role')).toBe('separator');
        expect(root.dataset.orientation).toBe('vertical');
        expect(root.getAttribute('aria-orientation')).toBe('vertical');
    });
});
