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
} from 'vue';
import { mount } from '@vue/test-utils';
import vuecsOverlays, {
    VCContextMenu,
    VCContextMenuContent,
    VCContextMenuItem,
    VCContextMenuTrigger,
} from '../../src';

function buildApp() {
    const App = defineComponent({
        setup() {
            return () => h(VCContextMenu, null, {
                default: () => [
                    h(VCContextMenuTrigger, { 'data-testid': 'trigger' }, () => h('div', 'Right-click me')),
                    h(VCContextMenuContent, { inline: true, 'data-testid': 'content' }, () => [
                        h(VCContextMenuItem, { 'data-testid': 'item' }, () => 'Action'),
                    ]),
                ],
            });
        },
    });

    return mount(App, {
        global: { plugins: [[vuecsOverlays, {}]] },
        attachTo: document.body,
    });
}

describe('<VCContextMenu>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders trigger and keeps content closed by default', async () => {
        const wrapper = buildApp();
        await nextTick();
        expect(wrapper.find('[data-testid="trigger"]').exists()).toBe(true);
        expect(document.body.querySelector('[data-testid="content"]')).toBeNull();
    });

    it('opens the content on contextmenu (right-click) event', async () => {
        const wrapper = buildApp();
        await nextTick();

        const trigger = wrapper.find('[data-testid="trigger"]').element as HTMLElement;
        trigger.dispatchEvent(new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            button: 2,
            clientX: 10,
            clientY: 10,
        }));
        await nextTick();
        await nextTick();

        expect(document.body.querySelector('[data-testid="content"]')).not.toBeNull();
        expect(document.body.querySelector('[data-testid="item"]')).not.toBeNull();
    });
});
