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
    VCHoverCard,
    VCHoverCardContent,
    VCHoverCardTrigger,
} from '../../src';

function buildApp(open = ref(false)) {
    const App = defineComponent({
        setup() {
            return () => h(VCHoverCard, {
                open: open.value,
                'onUpdate:open': (v: boolean) => { open.value = v; },
            }, {
                default: () => [
                    h(VCHoverCardTrigger, { 'data-testid': 'trigger' }, () => '@octocat'),
                    h(VCHoverCardContent, { inline: true, 'data-testid': 'content' }, () => 'Profile preview'),
                ],
            });
        },
    });

    return mount(App, {
        global: { plugins: [[vuecsOverlays, {}]] },
        attachTo: document.body,
    });
}

describe('<VCHoverCard>', () => {
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
