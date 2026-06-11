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
    VCModal,
    VCModalClose,
    VCModalContent,
    VCModalDescription,
    VCModalTitle,
    VCModalTrigger,
} from '../../src';

function buildApp(open = ref(false)) {
    const App = defineComponent({
        setup() {
            return () => h(VCModal, {
                open: open.value,
                'onUpdate:open': (v: boolean) => { open.value = v; },
            }, {
                default: () => [
                    h(VCModalTrigger, { 'data-testid': 'trigger' }, () => 'Open'),
                    h(VCModalContent, { inline: true, 'data-testid': 'content' }, {
                        default: () => [
                            h(VCModalTitle, () => 'Hello'),
                            h(VCModalDescription, () => 'Body'),
                            h(VCModalClose, { 'data-testid': 'close' }, () => 'Close'),
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

describe('<VCModal>', () => {
    afterEach(() => {
        // Reka portals + `attachTo: document.body` leak DOM across tests; the
        // next test's `document.body.querySelector(...)` would otherwise hit
        // a stale button still wired to the previous test's app instance.
        document.body.innerHTML = '';
    });

    it('renders a trigger but no content while closed', async () => {
        const wrapper = buildApp();
        await nextTick();

        expect(wrapper.find('[data-testid="trigger"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="content"]').exists()).toBe(false);
    });

    it('opens when v-model:open flips to true', async () => {
        const open = ref(false);
        buildApp(open);
        await nextTick();

        open.value = true;
        await nextTick();
        await nextTick();

        expect(document.body.querySelector('[data-testid="content"]')).not.toBeNull();
        expect(document.body.textContent).toContain('Hello');
    });

    it('closes when VCModalClose is clicked', async () => {
        const open = ref(true);
        buildApp(open);
        await nextTick();
        await nextTick();

        const close = document.body.querySelector<HTMLElement>('[data-testid="close"]');
        expect(close).not.toBeNull();
        close!.click();
        await nextTick();

        expect(open.value).toBe(false);
    });

    it('opens when the trigger is clicked', async () => {
        const open = ref(false);
        const wrapper = buildApp(open);
        await nextTick();

        const trigger = wrapper.find('[data-testid="trigger"]').element as HTMLElement;
        trigger.click();
        await nextTick();

        expect(open.value).toBe(true);
    });
});

describe('<VCModalContent> closePolicy', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    function buildPolicyApp(open = ref(true), closePolicy?: string) {
        const App = defineComponent({
            setup() {
                return () => h(VCModal, {
                    open: open.value,
                    'onUpdate:open': (v: boolean) => { open.value = v; },
                }, {
                    default: () => [
                        h(VCModalContent, {
                            inline: true, 
                            closePolicy, 
                            'data-testid': 'content', 
                        }, {
                            default: () => [
                                h(VCModalTitle, () => 'Hello'),
                                h(VCModalDescription, () => 'Body'),
                                h(VCModalClose, { 'data-testid': 'close' }, () => 'Close'),
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

    it('closes on Escape with the default policy', async () => {
        const open = ref(true);
        buildPolicyApp(open);
        await nextTick();
        await nextTick();

        pressEscape();
        await nextTick();

        expect(open.value).toBe(false);
    });

    it("keeps open on Escape with closePolicy 'no-escape'", async () => {
        const open = ref(true);
        buildPolicyApp(open, 'no-escape');
        await nextTick();
        await nextTick();

        pressEscape();
        await nextTick();

        expect(open.value).toBe(true);
    });

    it("keeps open on Escape with closePolicy 'never'", async () => {
        const open = ref(true);
        buildPolicyApp(open, 'never');
        await nextTick();
        await nextTick();

        pressEscape();
        await nextTick();

        expect(open.value).toBe(true);
    });

    it("still closes via VCModalClose with closePolicy 'never'", async () => {
        const open = ref(true);
        buildPolicyApp(open, 'never');
        await nextTick();
        await nextTick();

        const close = document.body.querySelector<HTMLElement>('[data-testid="close"]');
        expect(close).not.toBeNull();
        close!.click();
        await nextTick();

        expect(open.value).toBe(false);
    });

    const pointerDownOutside = async () => {
        // Reka's DismissableLayer attaches its document-level `pointerdown`
        // listener via setTimeout(0) after mount — wait one macrotask so the
        // listener is actually registered before dispatching.
        await new Promise((resolve) => { setTimeout(resolve, 1); });
        document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    };

    it('closes on outside pointerdown with the default policy', async () => {
        const open = ref(true);
        buildPolicyApp(open);
        await nextTick();
        await nextTick();

        await pointerDownOutside();
        await nextTick();

        expect(open.value).toBe(false);
    });

    it("keeps open on outside pointerdown with closePolicy 'no-outside'", async () => {
        const open = ref(true);
        buildPolicyApp(open, 'no-outside');
        await nextTick();
        await nextTick();

        await pointerDownOutside();
        await nextTick();

        expect(open.value).toBe(true);
    });

    it("keeps open on outside pointerdown with closePolicy 'never'", async () => {
        const open = ref(true);
        buildPolicyApp(open, 'never');
        await nextTick();
        await nextTick();

        await pointerDownOutside();
        await nextTick();

        expect(open.value).toBe(true);
    });

    it("still closes on Escape with closePolicy 'no-outside'", async () => {
        const open = ref(true);
        buildPolicyApp(open, 'no-outside');
        await nextTick();
        await nextTick();

        pressEscape();
        await nextTick();

        expect(open.value).toBe(false);
    });
});
