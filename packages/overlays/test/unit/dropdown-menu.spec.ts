// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue';
import { mount } from '@vue/test-utils';
import vuecsOverlays, {
    VCDropdownMenu,
    VCDropdownMenuContent,
    VCDropdownMenuItem,
    VCDropdownMenuSeparator,
    VCDropdownMenuTrigger,
} from '../../src';

function buildApp(open = ref(false), onSelect: (key: string) => void = () => {}) {
    const App = defineComponent({
        setup() {
            return () => h(VCDropdownMenu, {
                open: open.value,
                'onUpdate:open': (v: boolean) => { open.value = v; },
            }, {
                default: () => [
                    h(VCDropdownMenuTrigger, { 'data-testid': 'trigger' }, () => 'Menu'),
                    h(VCDropdownMenuContent, { inline: true, 'data-testid': 'content' }, () => [
                        h(VCDropdownMenuItem, {
                            'data-testid': 'item-edit',
                            onSelect: () => onSelect('edit'),
                        }, () => 'Edit'),
                        h(VCDropdownMenuSeparator),
                        h(VCDropdownMenuItem, {
                            'data-testid': 'item-delete',
                            onSelect: () => onSelect('delete'),
                        }, () => 'Delete'),
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

describe('<VCDropdownMenu>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders trigger but no content while closed', async () => {
        const wrapper = buildApp();
        await nextTick();
        expect(wrapper.find('[data-testid="trigger"]').exists()).toBe(true);
        expect(document.body.querySelector('[data-testid="content"]')).toBeNull();
    });

    it('shows content with items when open', async () => {
        const open = ref(true);
        buildApp(open);
        await nextTick();
        await nextTick();
        expect(document.body.querySelector('[data-testid="item-edit"]')).not.toBeNull();
        expect(document.body.querySelector('[data-testid="item-delete"]')).not.toBeNull();
    });

    it('fires select event when an item is clicked', async () => {
        const open = ref(true);
        const onSelect = vi.fn();
        buildApp(open, onSelect);
        await nextTick();
        await nextTick();
        const item = document.body.querySelector<HTMLElement>('[data-testid="item-edit"]');
        item!.click();
        await nextTick();
        expect(onSelect).toHaveBeenCalledWith('edit');
    });
});
