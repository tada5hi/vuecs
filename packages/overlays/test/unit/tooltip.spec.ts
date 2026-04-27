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
    VCTooltip,
    VCTooltipContent,
    VCTooltipProvider,
    VCTooltipTrigger,
} from '../../src';

function buildApp(open = ref(false)) {
    const App = defineComponent({
        setup() {
            return () => h(VCTooltipProvider, { delayDuration: 0 }, {
                default: () => h(VCTooltip, {
                    open: open.value,
                    'onUpdate:open': (v: boolean) => { open.value = v; },
                }, {
                    default: () => [
                        h(VCTooltipTrigger, { 'data-testid': 'trigger' }, () => 'Hover'),
                        h(VCTooltipContent, { inline: true, 'data-testid': 'content' }, () => 'Tip'),
                    ],
                }),
            });
        },
    });

    return mount(App, {
        global: { plugins: [[vuecsOverlays, {}]] },
        attachTo: document.body,
    });
}

describe('<VCTooltip>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders trigger but no content while closed', async () => {
        const wrapper = buildApp();
        await nextTick();
        expect(wrapper.find('[data-testid="trigger"]').exists()).toBe(true);
        expect(document.body.querySelector('[data-testid="content"]')).toBeNull();
    });

    it('shows content when controlled open flips true', async () => {
        const open = ref(false);
        buildApp(open);
        await nextTick();
        open.value = true;
        await nextTick();
        await nextTick();
        expect(document.body.querySelector('[data-testid="content"]')).not.toBeNull();
    });
});
