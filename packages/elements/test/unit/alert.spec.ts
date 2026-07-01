// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import {
    Comment,
    defineComponent,
    h,
    ref,
} from 'vue';
import { mount } from '@vue/test-utils';
import vuecsElements, {
    VCAlert,
    VCAlertClose,
    VCAlertDescription,
    VCAlertTitle,
} from '../../src';

const plugins = [[vuecsElements, {}]] as const;

describe('<VCAlert>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders the slot content with the base vc-alert class', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCAlert, null, { default: () => 'hello' });
            },
        }), { global: { plugins: [...plugins] } });
        const root = wrapper.element as HTMLElement;
        expect(root.tagName).toBe('DIV');
        expect(root.classList.contains('vc-alert')).toBe(true);
        expect(root.textContent).toContain('hello');
    });

    describe('ARIA role derivation', () => {
        it('uses role="alert" for color="error"', () => {
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'error' }, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
            expect(wrapper.element.getAttribute('role')).toBe('alert');
        });

        it('uses role="alert" for color="warning"', () => {
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'warning' }, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
            expect(wrapper.element.getAttribute('role')).toBe('alert');
        });

        it('uses role="status" for color="info"', () => {
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'info' }, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
            expect(wrapper.element.getAttribute('role')).toBe('status');
        });

        it('uses role="status" for color="success"', () => {
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'success' }, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
            expect(wrapper.element.getAttribute('role')).toBe('status');
        });

        it('uses role="status" for color="primary"', () => {
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'primary' }, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
            expect(wrapper.element.getAttribute('role')).toBe('status');
        });

        it('uses role="status" when no color is set', () => {
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, null, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
            expect(wrapper.element.getAttribute('role')).toBe('status');
        });

        it('explicit role overrides severity derivation', () => {
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'error', role: 'log' }, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
            expect(wrapper.element.getAttribute('role')).toBe('log');
        });
    });

    describe('icon resolution', () => {
        it('renders no icon when VCIcon is not registered', () => {
            // No icon preset configured, so defaults.errorIcon === ''.
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'error' }, { default: () => 'x' }) }), { global: { plugins: [...plugins] } });
            const root = wrapper.element as HTMLElement;
            expect(root.querySelector('.vc-alert-icon')).toBeNull();
        });

        it('renders the icon span when an explicit :icon is provided AND VCIcon is registered', () => {
            const VCIcon = defineComponent({
                name: 'VCIcon',
                props: ['name'],
                setup: (props) => () => h('span', { 'data-test-icon': props.name }),
            });
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'error', icon: 'lucide:x' }, { default: () => 'x' }) }), {
                global: {
                    plugins: [...plugins],
                    components: { VCIcon },
                },
            });
            const root = wrapper.element as HTMLElement;
            expect(root.querySelector('.vc-alert-icon')).not.toBeNull();
            expect(root.querySelector('[data-test-icon="lucide:x"]')).not.toBeNull();
        });

        it('explicit empty-string icon suppresses the icon even with color set', () => {
            const VCIcon = defineComponent({
                name: 'VCIcon',
                props: ['name'],
                setup: () => () => h('span'),
            });
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'error', icon: '' }, { default: () => 'x' }) }), {
                global: {
                    plugins: [...plugins],
                    components: { VCIcon },
                },
            });
            expect((wrapper.element as HTMLElement).querySelector('.vc-alert-icon')).toBeNull();
        });

        it('uses preset default icon for the matching color', () => {
            const VCIcon = defineComponent({
                name: 'VCIcon',
                props: ['name'],
                setup: (props) => () => h('span', { 'data-test-icon': props.name }),
            });
            // Install vuecsElements with defaults registering a preset for `alert.errorIcon`.
            const wrapper = mount(defineComponent({ setup: () => () => h(VCAlert, { color: 'error' }, { default: () => 'x' }) }), {
                global: {
                    plugins: [[
                        vuecsElements,
                        { defaults: { alert: { errorIcon: 'lucide:circle-x' } } },
                    ]],
                    components: { VCIcon },
                },
            });
            expect((wrapper.element as HTMLElement)
                .querySelector('[data-test-icon="lucide:circle-x"]')).not.toBeNull();
        });
    });

    describe('#icon slot', () => {
        it('renders the #icon slot inside the icon wrapper', () => {
            const wrapper = mount(defineComponent({
                setup: () => () => h(VCAlert, { color: 'warning' }, {
                    icon: () => h('svg', { 'data-test-slot-icon': '' }),
                    default: () => 'x',
                }),
            }), { global: { plugins: [...plugins] } });
            const iconWrapper = (wrapper.element as HTMLElement).querySelector('.vc-alert-icon');
            expect(iconWrapper).not.toBeNull();
            expect(iconWrapper!.getAttribute('aria-hidden')).toBe('true');
            expect(iconWrapper!.querySelector('[data-test-slot-icon]')).not.toBeNull();
        });

        it('takes precedence over the :icon prop and color-derived default', () => {
            const VCIcon = defineComponent({
                name: 'VCIcon',
                props: ['name'],
                setup: (props) => () => h('span', { 'data-test-icon': props.name }),
            });
            const wrapper = mount(defineComponent({
                setup: () => () => h(VCAlert, { color: 'error', icon: 'lucide:x' }, {
                    icon: () => h('svg', { 'data-test-slot-icon': '' }),
                    default: () => 'x',
                }),
            }), { global: { plugins: [...plugins], components: { VCIcon } } });
            const root = wrapper.element as HTMLElement;
            // Slot content is rendered; the prop-driven VCIcon is not.
            expect(root.querySelector('[data-test-slot-icon]')).not.toBeNull();
            expect(root.querySelector('[data-test-icon]')).toBeNull();
        });

        it('exposes the resolved icon-wrapper class as a slot prop', () => {
            let received: string | undefined;
            mount(defineComponent({
                setup: () => () => h(VCAlert, { color: 'warning' }, {
                    icon: (props: { class: string }) => {
                        received = props.class;
                        return h('span', 'x');
                    },
                    default: () => 'x',
                }),
            }), { global: { plugins: [...plugins] } });
            expect(received).toBe('vc-alert-icon');
        });

        it('an empty slot falls back to the :icon prop / default (no empty wrapper)', () => {
            const VCIcon = defineComponent({
                name: 'VCIcon',
                props: ['name'],
                setup: (props) => () => h('span', { 'data-test-icon': props.name }),
            });
            const wrapper = mount(defineComponent({
                setup: () => () => h(VCAlert, { color: 'error', icon: 'lucide:x' }, {
                    icon: () => null,
                    default: () => 'x',
                }),
            }), { global: { plugins: [...plugins], components: { VCIcon } } });
            const root = wrapper.element as HTMLElement;
            // Empty slot → fall back to the prop-driven icon.
            expect(root.querySelector('[data-test-icon="lucide:x"]')).not.toBeNull();
        });

        it('a whitespace-only / commented slot does not render an icon wrapper when the prop is suppressed', () => {
            const wrapper = mount(defineComponent({
                setup: () => () => h(VCAlert, { color: 'error', icon: '' }, {
                    icon: () => [h(Comment, ''), '   '],
                    default: () => 'x',
                }),
            }), { global: { plugins: [...plugins] } });
            expect((wrapper.element as HTMLElement).querySelector('.vc-alert-icon')).toBeNull();
        });
    });

    describe('compound parts', () => {
        it('renders title + description inside the content wrapper', () => {
            const wrapper = mount(defineComponent({
                setup() {
                    return () => h(VCAlert, null, {
                        default: () => [
                            h(VCAlertTitle, null, { default: () => 'Title' }),
                            h(VCAlertDescription, null, { default: () => 'Body' }),
                        ],
                    });
                },
            }), { global: { plugins: [...plugins] } });
            const root = wrapper.element as HTMLElement;
            const content = root.querySelector('.vc-alert-content');
            expect(content).not.toBeNull();
            expect(content!.querySelector('.vc-alert-title')!.textContent).toBe('Title');
            expect(content!.querySelector('.vc-alert-description')!.textContent).toBe('Body');
        });
    });
});

describe('<VCAlertClose>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('slotless renders the closeIcon slot + default × glyph + Close aria-label', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCAlert, null, { default: () => h(VCAlertClose) });
            },
        }), { global: { plugins: [...plugins] } });
        const btn = (wrapper.element as HTMLElement).querySelector('button')!;
        expect(btn.classList.contains('vc-alert-close-icon')).toBe(true);
        expect(btn.classList.contains('vc-alert-close')).toBe(false);
        expect(btn.textContent).toBe('×');
        expect(btn.getAttribute('aria-label')).toBe('Close');
        expect(btn.getAttribute('type')).toBe('button');
    });

    it('with slot content renders the close slot, NO default aria-label', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCAlert, null, { default: () => h(VCAlertClose, null, { default: () => 'Cancel' }) });
            },
        }), { global: { plugins: [...plugins] } });
        const btn = (wrapper.element as HTMLElement).querySelector('button')!;
        expect(btn.classList.contains('vc-alert-close')).toBe(true);
        expect(btn.classList.contains('vc-alert-close-icon')).toBe(false);
        expect(btn.textContent).toBe('Cancel');
        expect(btn.getAttribute('aria-label')).toBeNull();
    });

    it('explicit :icon prop forces closeIcon slot + default Close aria-label even with slot content', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCAlert, null, { default: () => h(VCAlertClose, { icon: true }, { default: () => h('svg', { 'data-test-svg': '' }) }) });
            },
        }), { global: { plugins: [...plugins] } });
        const btn = (wrapper.element as HTMLElement).querySelector('button')!;
        expect(btn.classList.contains('vc-alert-close-icon')).toBe(true);
        expect(btn.getAttribute('aria-label')).toBe('Close');
        expect(btn.querySelector('[data-test-svg]')).not.toBeNull();
    });

    it('consumer aria-label overrides the default', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCAlert, null, { default: () => h(VCAlertClose, { 'aria-label': 'Dismiss alert' }) });
            },
        }), { global: { plugins: [...plugins] } });
        const btn = (wrapper.element as HTMLElement).querySelector('button')!;
        expect(btn.getAttribute('aria-label')).toBe('Dismiss alert');
    });

    it('click event fires on the button (consumer handles dismissal)', async () => {
        let clicked = 0;
        const visible = ref(true);
        const wrapper = mount(defineComponent({
            setup() {
                return () => (visible.value ? h(VCAlert, null, {
                    default: () => h(VCAlertClose, {
                        onClick: () => {
                            clicked += 1;
                            visible.value = false;
                        },
                    }),
                }) : null);
            },
        }), { global: { plugins: [...plugins] } });

        const btn = (wrapper.element as HTMLElement).querySelector('button')!;
        btn.click();
        await wrapper.vm.$nextTick();
        expect(clicked).toBe(1);
        expect(visible.value).toBe(false);
    });
});
