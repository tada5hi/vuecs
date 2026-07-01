// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue';
import { mount } from '@vue/test-utils';
import vuecsOverlays, {
    VCAlertDialog,
    VCAlertDialogAction,
    VCAlertDialogCancel,
    VCAlertDialogContent,
    VCAlertDialogDescription,
    VCAlertDialogTitle,
    VCAlertDialogTrigger,
} from '../../src';

function buildApp(open = ref(false), noEscape = false) {
    const App = defineComponent({
        setup() {
            return () => h(VCAlertDialog, {
                open: open.value,
                'onUpdate:open': (v: boolean) => { open.value = v; },
            }, {
                default: () => [
                    h(VCAlertDialogTrigger, { 'data-testid': 'trigger' }, () => 'Open'),
                    h(VCAlertDialogContent, {
                        inline: true, 
                        noEscape, 
                        'data-testid': 'content', 
                    }, {
                        default: () => [
                            h(VCAlertDialogTitle, () => 'Delete?'),
                            h(VCAlertDialogDescription, () => 'This cannot be undone.'),
                            h(VCAlertDialogCancel, { 'data-testid': 'cancel' }, () => 'Cancel'),
                            h(VCAlertDialogAction, { 'data-testid': 'action' }, () => 'Delete'),
                        ],
                    }),
                ],
            });
        },
    });

    return mount(App, {
        global: { plugins: [[vuecsOverlays, {}]] },
        attachTo: document.body,
    });
}

const pressEscape = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
    }));
};

describe('<VCAlertDialog>', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders a trigger but no content while closed', async () => {
        const wrapper = buildApp();
        await nextTick();

        expect(wrapper.find('[data-testid="trigger"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="content"]').exists()).toBe(false);
    });

    it('opens with role="alertdialog" when v-model:open flips to true', async () => {
        const open = ref(false);
        const wrapper = buildApp(open);
        await nextTick();

        open.value = true;
        await nextTick();
        await nextTick();

        expect(wrapper.find('[data-testid="content"]').exists()).toBe(true);
        // The defining a11y difference from a plain Modal (role="dialog").
        expect(wrapper.find('[role="alertdialog"]').exists()).toBe(true);
        expect(wrapper.text()).toContain('Delete?');
    });

    it('closes when the Action button is clicked', async () => {
        const open = ref(true);
        const wrapper = buildApp(open);
        await nextTick();
        await nextTick();

        await wrapper.find('[data-testid="action"]').trigger('click');
        await nextTick();

        expect(open.value).toBe(false);
    });

    it('closes when the Cancel button is clicked', async () => {
        const open = ref(true);
        const wrapper = buildApp(open);
        await nextTick();
        await nextTick();

        await wrapper.find('[data-testid="cancel"]').trigger('click');
        await nextTick();

        expect(open.value).toBe(false);
    });

    it('closes on Escape by default', async () => {
        const open = ref(true);
        buildApp(open);
        await nextTick();
        await nextTick();

        pressEscape();
        await nextTick();

        expect(open.value).toBe(false);
    });

    it('keeps open on Escape when noEscape is set', async () => {
        const open = ref(true);
        buildApp(open, true);
        await nextTick();
        await nextTick();

        pressEscape();
        await nextTick();

        expect(open.value).toBe(true);
    });
});

describe('<VCAlertDialogAction> / <VCAlertDialogCancel> manual mode', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('manual Action: a click does NOT close; the exposed confirm() does', async () => {
        const open = ref(true);
        let confirmFn: (() => void) | undefined;
        const App = defineComponent({
            setup() {
                return () => h(VCAlertDialog, {
                    open: open.value,
                    'onUpdate:open': (v: boolean) => { open.value = v; },
                }, {
                    default: () => h(VCAlertDialogContent, { inline: true }, {
                        default: () => [
                            h(VCAlertDialogTitle, () => 'T'),
                            h(VCAlertDialogAction, { manual: true, 'data-testid': 'action' }, {
                                default: (p: { confirm: () => void }) => {
                                    confirmFn = p.confirm;
                                    return 'Go';
                                },
                            }),
                        ],
                    }),
                });
            },
        });
        mount(App, { global: { plugins: [[vuecsOverlays, {}]] }, attachTo: document.body });
        await nextTick();
        await nextTick();

        // Auto-close is suppressed: clicking the button must not close.
        document.body.querySelector<HTMLElement>('[data-testid="action"]')!.click();
        await nextTick();
        expect(open.value).toBe(true);

        // The exposed trigger closes it.
        confirmFn!();
        await nextTick();
        expect(open.value).toBe(false);
    });

    it('manual Cancel: the exposed cancel() closes', async () => {
        const open = ref(true);
        let cancelFn: (() => void) | undefined;
        const App = defineComponent({
            setup() {
                return () => h(VCAlertDialog, {
                    open: open.value,
                    'onUpdate:open': (v: boolean) => { open.value = v; },
                }, {
                    default: () => h(VCAlertDialogContent, { inline: true }, {
                        default: () => [
                            h(VCAlertDialogTitle, () => 'T'),
                            h(VCAlertDialogCancel, { manual: true }, {
                                default: (p: { cancel: () => void }) => {
                                    cancelFn = p.cancel;
                                    return 'Cancel';
                                },
                            }),
                        ],
                    }),
                });
            },
        });
        mount(App, { global: { plugins: [[vuecsOverlays, {}]] }, attachTo: document.body });
        await nextTick();
        await nextTick();

        expect(open.value).toBe(true);
        cancelFn!();
        await nextTick();
        expect(open.value).toBe(false);
    });
});
