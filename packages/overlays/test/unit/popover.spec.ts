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
    VCPopover,
    VCPopoverContent,
    VCPopoverTrigger,
} from '../../src';

function buildApp(open = ref(false)) {
    const App = defineComponent({
        setup() {
            return () => h(VCPopover, {
                open: open.value,
                'onUpdate:open': (v: boolean) => { open.value = v; },
            }, {
                default: () => [
                    h(VCPopoverTrigger, { 'data-testid': 'trigger' }, () => 'Open'),
                    h(VCPopoverContent, { inline: true, 'data-testid': 'content' }, () => 'Body'),
                ],
            });
        },
    });

    return mount(App, {
        global: { plugins: [[vuecsOverlays, {}]] },
        attachTo: document.body,
    });
}

describe('<VCPopover>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders trigger but no content while closed', async () => {
        const wrapper = buildApp();
        await nextTick();
        expect(wrapper.find('[data-testid="trigger"]').exists()).toBe(true);
        expect(document.body.querySelector('[data-testid="content"]')).toBeNull();
    });

    it('shows content when v-model:open flips to true', async () => {
        const open = ref(false);
        buildApp(open);
        await nextTick();
        open.value = true;
        await nextTick();
        await nextTick();
        expect(document.body.querySelector('[data-testid="content"]')).not.toBeNull();
    });

    it('opens when trigger is clicked', async () => {
        const open = ref(false);
        const wrapper = buildApp(open);
        await nextTick();
        const trigger = wrapper.find('[data-testid="trigger"]').element as HTMLElement;
        trigger.click();
        await nextTick();
        expect(open.value).toBe(true);
    });
});
