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

    it('renders trigger but no content until right-clicked', async () => {
        const wrapper = buildApp();
        await nextTick();
        expect(wrapper.find('[data-testid="trigger"]').exists()).toBe(true);
        expect(document.body.querySelector('[data-testid="content"]')).toBeNull();
    });
});
