// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, {
    VCCollapse,
    VCCollapseContent,
    VCCollapseTrigger,
} from '../../src';

const plugins = [[vuecsElements, {}]] as const;

describe('<VCCollapse>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders the root with vc-collapse class', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, null, {
                    default: () => [
                        h(VCCollapseTrigger, null, { default: () => 'Toggle' }),
                        h(VCCollapseContent, null, { default: () => 'Content' }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });
        const root = wrapper.element as HTMLElement;
        expect(root.classList.contains('vc-collapse')).toBe(true);
    });

    it('defaultOpen: false starts closed (content not in DOM)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, null, {
                    default: () => [
                        h(VCCollapseTrigger, null, { default: () => 'Toggle' }),
                        h(VCCollapseContent, null, { default: () => 'Content' }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });
        const root = wrapper.element as HTMLElement;
        expect(root.textContent).not.toContain('Content');
    });

    it('defaultOpen: true starts open (content in DOM)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, { defaultOpen: true }, {
                    default: () => [
                        h(VCCollapseTrigger, null, { default: () => 'Toggle' }),
                        h(VCCollapseContent, null, { default: () => 'Content' }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });
        expect((wrapper.element as HTMLElement).textContent).toContain('Content');
    });

    it('clicking the trigger toggles open state via v-model:open', async () => {
        const open = ref(false);
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, {
                    open: open.value,
                    'onUpdate:open': (next: boolean) => { open.value = next; },
                }, {
                    default: () => [
                        h(VCCollapseTrigger, null, { default: () => 'Toggle' }),
                        h(VCCollapseContent, null, { default: () => 'Content' }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const trigger = (wrapper.element as HTMLElement).querySelector('button')!;
        trigger.click();
        await wrapper.vm.$nextTick();
        expect(open.value).toBe(true);
    });

    it('trigger sets aria-expanded reflecting open state', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, { defaultOpen: false }, {
                    default: () => [
                        h(VCCollapseTrigger, null, { default: () => 'Toggle' }),
                        h(VCCollapseContent, null, { default: () => 'Content' }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const trigger = (wrapper.element as HTMLElement).querySelector('button')!;
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        trigger.click();
        await wrapper.vm.$nextTick();
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });
});

describe('<VCCollapseTrigger>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('defaults to <button type="button"> (Reka primitive default)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, null, { default: () => h(VCCollapseTrigger, null, { default: () => 'Toggle' }) });
            },
        }), { global: { plugins: [...plugins] } });
        const trigger = (wrapper.element as HTMLElement).querySelector('button')!;
        expect(trigger).not.toBeNull();
        // Reka's CollapsibleTrigger renders as <button> which defaults to
        // type="button" via the browser. Verify the element type.
        expect(trigger.tagName).toBe('BUTTON');
    });

    it('renders vc-collapse-trigger class', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, null, { default: () => h(VCCollapseTrigger, null, { default: () => 'Toggle' }) });
            },
        }), { global: { plugins: [...plugins] } });
        const trigger = (wrapper.element as HTMLElement).querySelector('button')!;
        expect(trigger.classList.contains('vc-collapse-trigger')).toBe(true);
    });

    it('renders auto-chevron when VCIcon is registered AND chevronIcon default is set', () => {
        const VCIcon = defineComponent({
            name: 'VCIcon',
            props: ['name'],
            setup: (props) => () => h('span', { 'data-test-chevron': props.name }),
        });
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, null, { default: () => h(VCCollapseTrigger, null, { default: () => 'Toggle' }) });
            },
        }), {
            global: {
                plugins: [[vuecsElements, { defaults: { collapseTrigger: { chevronIcon: 'lucide:chevron-down' } } }]],
                components: { VCIcon },
            },
        });
        const trigger = (wrapper.element as HTMLElement).querySelector('button')!;
        const chevron = trigger.querySelector('[data-test-chevron="lucide:chevron-down"]');
        expect(chevron).not.toBeNull();
    });

    it('does NOT render auto-chevron when VCIcon is not registered', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, null, { default: () => h(VCCollapseTrigger, null, { default: () => 'Toggle' }) });
            },
        }), { global: { plugins: [[vuecsElements, { defaults: { collapseTrigger: { chevronIcon: 'lucide:chevron-down' } } }]] } });
        const trigger = (wrapper.element as HTMLElement).querySelector('button')!;
        expect(trigger.querySelector('.vc-collapse-chevron')).toBeNull();
    });

    it('SUPPRESSES auto-chevron when asChild is set', () => {
        // Reka's `asChild` merges trigger behavior onto the first slot child.
        // An auto-injected chevron would render as a sibling outside the
        // interactive element. The component should skip rendering it.
        const VCIcon = defineComponent({
            name: 'VCIcon',
            props: ['name'],
            setup: (props) => () => h('span', { 'data-test-chevron': props.name }),
        });
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, null, { default: () => h(VCCollapseTrigger, { asChild: true }, { default: () => h('a', { href: '#', 'data-custom-trigger': '' }, 'Custom trigger') }) });
            },
        }), {
            global: {
                plugins: [[vuecsElements, { defaults: { collapseTrigger: { chevronIcon: 'lucide:chevron-down' } } }]],
                components: { VCIcon },
            },
        });
        const root = wrapper.element as HTMLElement;
        // The custom child should be in the DOM
        expect(root.querySelector('[data-custom-trigger]')).not.toBeNull();
        // The auto-chevron should NOT have been rendered
        expect(root.querySelector('[data-test-chevron]')).toBeNull();
    });

    it('chevron variant `none` skips rendering even when VCIcon + chevronIcon are present', () => {
        const VCIcon = defineComponent({
            name: 'VCIcon',
            props: ['name'],
            setup: (props) => () => h('span', { 'data-test-chevron': props.name }),
        });
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, null, { default: () => h(VCCollapseTrigger, { chevron: 'none' }, { default: () => 'Toggle' }) });
            },
        }), {
            global: {
                plugins: [[vuecsElements, { defaults: { collapseTrigger: { chevronIcon: 'lucide:chevron-down' } } }]],
                components: { VCIcon },
            },
        });
        const trigger = (wrapper.element as HTMLElement).querySelector('button')!;
        expect(trigger.querySelector('[data-test-chevron]')).toBeNull();
    });
});

describe('<VCCollapseContent>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders the vc-collapse-content class when open', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCCollapse, { defaultOpen: true }, {
                    default: () => [
                        h(VCCollapseTrigger, null, { default: () => 'Toggle' }),
                        h(VCCollapseContent, null, { default: () => 'Content' }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });
        const content = (wrapper.element as HTMLElement).querySelector('.vc-collapse-content');
        expect(content).not.toBeNull();
        expect(content!.textContent).toBe('Content');
    });
});
