// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, { VCEmptyState } from '../../src';
import type { EmptyStateActionSlotProps } from '../../src';

const plugins = [[vuecsElements, {}]] as const;

describe('<VCEmptyState>', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders title and description with the base vc-empty-state class', () => {
        const wrapper = mount(VCEmptyState, {
            props: { title: 'No users', description: 'Create one to get started.' },
            global: { plugins: [...plugins] },
        });
        const root = wrapper.element as HTMLElement;

        expect(root.tagName).toBe('DIV');
        expect(root.classList.contains('vc-empty-state')).toBe(true);
        expect(root.getAttribute('role')).toBeNull();
        expect(root.querySelector('.vc-empty-state-title')!.textContent).toBe('No users');
        expect(root.querySelector('.vc-empty-state-description')!.textContent).toBe('Create one to get started.');
    });

    it('renders via the `as` prop', () => {
        const wrapper = mount(VCEmptyState, { props: { as: 'section', title: 'x' }, global: { plugins: [...plugins] } });

        expect(wrapper.element.tagName).toBe('SECTION');
    });

    it('default slot replaces the description', () => {
        const wrapper = mount(VCEmptyState, {
            props: { title: 'No users', description: 'ignored' },
            slots: { default: () => h('p', { 'data-test-body': '' }, 'custom body') },
            global: { plugins: [...plugins] },
        });
        const root = wrapper.element as HTMLElement;

        expect(root.querySelector('[data-test-body]')).not.toBeNull();
        expect(root.textContent).not.toContain('ignored');
    });

    it('title slot replaces the title prop', () => {
        const wrapper = mount(VCEmptyState, {
            props: { title: 'ignored' },
            slots: { title: () => 'Custom title' },
            global: { plugins: [...plugins] },
        });

        expect(wrapper.find('.vc-empty-state-title').text()).toBe('Custom title');
    });

    it('renders no action element when neither actionLabel nor #action is present', () => {
        const wrapper = mount(VCEmptyState, { props: { title: 'x' }, global: { plugins: [...plugins] } });

        expect(wrapper.find('button').exists()).toBe(false);
        expect(wrapper.find('.vc-empty-state-action').exists()).toBe(false);
    });

    it('renders a button for actionLabel and emits `action` once on click', async () => {
        const wrapper = mount(VCEmptyState, {
            props: { title: 'x', actionLabel: 'Create user' },
            global: { plugins: [...plugins] },
        });
        const button = wrapper.find('button');

        expect(button.exists()).toBe(true);
        expect(button.attributes('type')).toBe('button');
        expect(button.classes()).toContain('vc-empty-state-action');
        expect(button.text()).toBe('Create user');

        await button.trigger('click');

        expect(wrapper.emitted('action')).toHaveLength(1);
        expect(wrapper.emitted('action')![0]).toEqual([]);
    });

    it('#action slot receives { class, action } and calling action() emits', async () => {
        let captured: EmptyStateActionSlotProps | undefined;
        const wrapper = mount(VCEmptyState, {
            props: { title: 'x', actionLabel: 'ignored' },
            slots: {
                action: (props: EmptyStateActionSlotProps) => {
                    captured = props;

                    return h('a', {
                        class: props.class, 
                        href: '#', 
                        onClick: props.action, 
                    }, 'Go');
                },
            },
            global: { plugins: [...plugins] },
        });

        expect(captured).toBeDefined();
        expect(captured!.class).toContain('vc-empty-state-action');
        expect(wrapper.find('button').exists()).toBe(false);

        await wrapper.find('a').trigger('click');

        expect(wrapper.emitted('action')).toHaveLength(1);
    });

    it('variant="noResults" with no props renders the default copy and a Reset button', () => {
        const wrapper = mount(VCEmptyState, { props: { variant: 'noResults' }, global: { plugins: [...plugins] } });

        expect(wrapper.find('.vc-empty-state-title').text()).toBe('No results');
        expect(wrapper.find('.vc-empty-state-description').text()).toBe('Try adjusting your search or filters.');
        expect(wrapper.find('button').text()).toBe('Reset');
    });

    it('variant="empty" has no default copy', () => {
        const wrapper = mount(VCEmptyState, { global: { plugins: [...plugins] } });

        expect(wrapper.find('.vc-empty-state-title').exists()).toBe(false);
        expect(wrapper.find('.vc-empty-state-description').exists()).toBe(false);
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('explicit props beat the noResults defaults', () => {
        const wrapper = mount(VCEmptyState, {
            props: {
                variant: 'noResults',
                title: 'Nothing here',
                description: 'Nope.',
                actionLabel: 'Clear',
            },
            global: { plugins: [...plugins] },
        });

        expect(wrapper.find('.vc-empty-state-title').text()).toBe('Nothing here');
        expect(wrapper.find('.vc-empty-state-description').text()).toBe('Nope.');
        expect(wrapper.find('button').text()).toBe('Clear');
    });

    it('noResults defaults are overridable via global defaults', () => {
        const wrapper = mount(VCEmptyState, {
            props: { variant: 'noResults' },
            global: { plugins: [[vuecsElements, { defaults: { emptyState: { noResultsActionLabel: 'Zurücksetzen' } } }]] },
        });

        expect(wrapper.find('button').text()).toBe('Zurücksetzen');
        expect(wrapper.find('.vc-empty-state-title').text()).toBe('No results');
    });

    it('#icon slot renders inside the icon wrapper', () => {
        const wrapper = mount(VCEmptyState, {
            props: { title: 'x' },
            slots: { icon: () => h('svg', { 'data-test-icon': '' }) },
            global: { plugins: [...plugins] },
        });
        const iconWrapper = (wrapper.element as HTMLElement).querySelector('.vc-empty-state-icon');

        expect(iconWrapper).not.toBeNull();
        expect(iconWrapper!.querySelector('[data-test-icon]')).not.toBeNull();
    });

    it('icon prop renders <VCIcon> when registered, aria-hidden', () => {
        const VCIcon = defineComponent({
            name: 'VCIcon',
            props: ['name'],
            setup: (props) => () => h('span', { 'data-test-icon': props.name }),
        });
        const wrapper = mount(VCEmptyState, {
            props: { title: 'x', icon: 'lucide:inbox' },
            global: { plugins: [...plugins], components: { VCIcon } },
        });
        const iconWrapper = (wrapper.element as HTMLElement).querySelector('.vc-empty-state-icon');

        expect(iconWrapper!.getAttribute('aria-hidden')).toBe('true');
        expect(iconWrapper!.querySelector('[data-test-icon="lucide:inbox"]')).not.toBeNull();
    });

    it('icon prop renders nothing when VCIcon is not registered', () => {
        const wrapper = mount(VCEmptyState, { props: { title: 'x', icon: 'lucide:inbox' }, global: { plugins: [...plugins] } });

        expect(wrapper.find('.vc-empty-state-icon').exists()).toBe(false);
    });

    it('does not warn when VCIcon is not registered', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        try {
            mount(VCEmptyState, { props: { title: 'x' }, global: { plugins: [...plugins] } });
            mount(VCEmptyState, { props: { title: 'x', icon: 'lucide:inbox' }, global: { plugins: [...plugins] } });

            const messages = warn.mock.calls.map((args) => String(args[0]));

            expect(messages.filter((m) => m.includes('VCIcon'))).toEqual([]);
        } finally {
            warn.mockRestore();
        }
    });

    it('applies themeClass.root', () => {
        const wrapper = mount(VCEmptyState, {
            props: { title: 'x', themeClass: { root: 'my-root' } },
            global: { plugins: [...plugins] },
        });

        expect(wrapper.classes()).toContain('my-root');
    });

    it('passes `variant` through to theme variants', () => {
        const wrapper = mount(VCEmptyState, {
            props: { variant: 'noResults' },
            global: {
                plugins: [[vuecsElements, {
                    themes: [{
                        elements: {
                            emptyState: {
                                classes: { root: 'es' },
                                variants: { variant: { empty: { root: 'is-empty' }, noResults: { root: 'is-no-results' } } },
                            },
                        },
                    }],
                }]],
            },
        });

        expect(wrapper.classes()).toContain('is-no-results');
        expect(wrapper.classes()).not.toContain('is-empty');
    });
});
