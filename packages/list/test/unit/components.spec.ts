// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import type { App } from 'vue';
import { mount } from '@vue/test-utils';
import { installConfigManager, installDefaultsManager, installThemeManager } from '@vuecs/core';
import {
    VCList,
    VCListBody,
    VCListEmpty,
    VCListItem,
    VCListLoading,
    defineList,
} from '../../src';

type User = { id: number; name: string };

function withVuecs(
    setup: () => unknown,
    themeOptions: Parameters<typeof installThemeManager>[1] = {},
) {
    const App = defineComponent({ setup: () => setup });
    return mount(App, {
        global: {
            plugins: [{
                install(app: App) {
                    installThemeManager(app, themeOptions);
                    installDefaultsManager(app, {});
                    installConfigManager(app, {});
                },
            }],
        },
    });
}

describe('VCList — outer container + slot prop', () => {
    it('renders a <div> outer container with the default theme class', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [] }, { default: () => undefined }));
        const root = wrapper.find('.vc-list');
        expect(root.exists()).toBe(true);
        expect(root.element.tagName).toBe('DIV');
    });

    it('exposes resolved theme classes via the default slot prop', () => {
        // Consumer destructures { classes } and applies classes.header /
        // classes.footer to their own <header> / <footer> markup.
        const wrapper = withVuecs(() => h(VCList, { data: [] }, {
            default: ({ classes }: { classes: { header: string; footer: string } }) => [
                h('header', { class: [classes.header, 'consumer-header'] }, 'H'),
                h('footer', { class: [classes.footer, 'consumer-footer'] }, 'F'),
            ],
        }));

        const header = wrapper.find('.consumer-header');
        expect(header.exists()).toBe(true);
        expect(header.classes()).toContain('vc-list-header');
        expect(wrapper.find('.consumer-footer').classes()).toContain('vc-list-footer');
    });

    it('honors the `tag` prop for the outer container', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [], tag: 'section' }, { default: () => undefined }));
        expect(wrapper.element.tagName).toBe('SECTION');
    });
});

describe('VCListBody — render condition + iteration', () => {
    it('renders the <ul> only when data is present', () => {
        const empty = withVuecs(() => h(VCList, { data: [] }, { default: () => [h(VCListBody)] }));
        expect(empty.find('.vc-list-body').exists()).toBe(false);

        const populated = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, { default: () => [h(VCListBody, {}, { item: ({ data }: { data: User }) => h(VCListItem, { data }, { default: () => data.name }) })] }));
        expect(populated.find('.vc-list-body').exists()).toBe(true);
        expect(populated.find('.vc-list-body').element.tagName).toBe('UL');
    });

    it('keeps the <ul> rendered while busy (decouples body from busy)', () => {
        // Loading-Inline / Loading-Skeleton patterns need <ul> visible
        // during loading — the render condition is data-presence only.
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[], busy: true }, { default: () => [h(VCListBody, {}, { item: ({ data }: { data: User }) => h(VCListItem, { data }, { default: () => data.name }) })] }));

        expect(wrapper.find('.vc-list-body').exists()).toBe(true);
        expect(wrapper.findAll('.vc-list-item').length).toBe(1);
    });

    it('auto-iterates `#item` slot to <li>s with per-row slot props', () => {
        const wrapper = withVuecs(() => h(VCList, {
            data: [
                { id: 1, name: 'a' },
                { id: 2, name: 'b' },
            ] as User[],
        }, {
            default: () => [h(VCListBody, {}, {
                item: ({ data, index }: { data: User; index: number }) =>
                    h(VCListItem, { data }, { default: () => `${index}:${data.name}` }),
            })],
        }));

        const items = wrapper.findAll('.vc-list-item');
        expect(items.length).toBe(2);
        expect(items[0]!.element.tagName).toBe('LI');
        expect(items[0]!.text()).toBe('0:a');
        expect(items[1]!.text()).toBe('1:b');
    });

    it('reuses DOM identity across reorders via `itemKey`', async () => {
        const data = ref<User[]>([
            { id: 1, name: 'a' },
            { id: 2, name: 'b' },
        ]);
        const state = defineList<User>({ data, itemKey: 'id' });
        const wrapper = withVuecs(() => h(VCList, { state }, { default: () => [h(VCListBody, {}, { item: ({ data: row }: { data: User }) => h(VCListItem, { data: row }, { default: () => h('span', { class: 'name', 'data-name': row.name }, row.name) }) })] }));

        const initial = wrapper.findAll('.name').map((r) => r.element);
        expect(initial.map((el) => (el as HTMLElement).dataset.name)).toEqual(['a', 'b']);

        data.value = [data.value[1]!, data.value[0]!];
        await wrapper.vm.$nextTick();

        const reordered = wrapper.findAll('.name').map((r) => r.element);
        expect(reordered.map((el) => (el as HTMLElement).dataset.name)).toEqual(['b', 'a']);
        expect(reordered[0]).toBe(initial[1]);
        expect(reordered[1]).toBe(initial[0]);
    });
});

describe('VCListItem — slot props + row state', () => {
    it('exposes resolved item-level classes via the default slot', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, {
            default: () => [h(VCListBody, {}, {
                item: ({ data }: { data: User }) => h(VCListItem, { data }, {
                    default: ({ classes }: { classes: { text: string; actions: string } }) => [
                        h('span', { class: classes.text }, data.name),
                        h('span', { class: classes.actions }, h('button', null, 'edit')),
                    ],
                }),
            })],
        }));

        const item = wrapper.find('.vc-list-item');
        expect(item.exists()).toBe(true);
        expect(item.find('.vc-list-item-text').text()).toBe('a');
        expect(item.find('.vc-list-item-actions button').text()).toBe('edit');
    });

    it('applies aria-disabled and data-disabled when :disabled is set', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, { default: () => [h(VCListBody, {}, { item: ({ data }: { data: User }) => h(VCListItem, { data, disabled: true }, { default: () => data.name }) })] }));

        const li = wrapper.find('.vc-list-item');
        expect(li.attributes('aria-disabled')).toBe('true');
        expect(li.attributes('data-disabled')).toBe('');
    });

    it('applies aria-current and data-active when :active is set', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, { default: () => [h(VCListBody, {}, { item: ({ data }: { data: User }) => h(VCListItem, { data, active: 'page' }, { default: () => data.name }) })] }));

        const li = wrapper.find('.vc-list-item');
        expect(li.attributes('aria-current')).toBe('page');
        expect(li.attributes('data-active')).toBe('');
    });

    it('folds row-state props + derived selection into themeVariant', () => {
        // Regression guard: disabled/active/selected must drive theme
        // variant resolution. Without folding, theme entries like
        // `listItem.variants.disabled.true = { root: 'X' }` never fire.
        const wrapper = withVuecs(() => h(VCList, {
            data: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }] as User[],
            selectionMode: 'multi',
            selection: [1],
        }, {
            default: () => [h(VCListBody, {}, {
                item: ({ data }: { data: User }) => h(VCListItem, {
                    data,
                    selectable: true,
                    disabled: data.id === 2,
                }, { default: () => data.name }),
            })],
        }), {
            themes: [{
                elements: {
                    listItem: {
                        variants: {
                            disabled: { true: { root: 'cls-disabled' } },
                            selected: { true: { root: 'cls-selected' } },
                        },
                    },
                },
            }],
        });

        const items = wrapper.findAll('.vc-list-item');
        // First row is selected (id=1 in selection), second row is disabled.
        expect(items[0]!.classes()).toContain('cls-selected');
        expect(items[0]!.classes()).not.toContain('cls-disabled');
        expect(items[1]!.classes()).toContain('cls-disabled');
        expect(items[1]!.classes()).not.toContain('cls-selected');
    });
});

describe('VCListEmpty / VCListLoading — render conditions', () => {
    it('renders Empty only when !busy && data.length === 0', async () => {
        const data = ref<User[]>([]);
        const busy = ref(false);
        const wrapper = withVuecs(() => h(VCList, {
            data: data.value,
            busy: busy.value,
        }, { default: () => [h(VCListEmpty, {}, { default: () => 'no rows' })] }));

        expect(wrapper.find('.vc-list-empty').exists()).toBe(true);
        expect(wrapper.find('.vc-list-empty').attributes('role')).toBe('status');
        expect(wrapper.text()).toContain('no rows');

        // Suppressed while busy
        await wrapper.setProps({ busy: true });
        expect(wrapper.find('.vc-list-empty').exists()).toBe(false);

        // Suppressed when data is present
        await wrapper.setProps({ busy: false, data: [{ id: 1, name: 'a' }] as User[] });
        expect(wrapper.find('.vc-list-empty').exists()).toBe(false);
    });

    it('falls back to global default content when Empty has no slot', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [] }, { default: () => [h(VCListEmpty)] }));
        const emptyEl = wrapper.find('.vc-list-empty');
        expect(emptyEl.exists()).toBe(true);
        expect(emptyEl.text().length).toBeGreaterThan(0);
    });

    it('renders Loading only when busy && data.length === 0 by default', async () => {
        const data = ref<User[]>([]);
        const busy = ref(true);
        const wrapper = withVuecs(() => h(VCList, {
            data: data.value,
            busy: busy.value,
        }, { default: () => [h(VCListLoading, {}, { default: () => 'loading…' })] }));

        expect(wrapper.find('.vc-list-loading').exists()).toBe(true);
        expect(wrapper.find('.vc-list-loading').attributes('role')).toBe('status');
        expect(wrapper.find('.vc-list-loading').attributes('aria-live')).toBe('polite');

        // Busy but data present → loading hides (default mode is first-load only)
        await wrapper.setProps({ data: [{ id: 1, name: 'a' }] as User[] });
        expect(wrapper.find('.vc-list-loading').exists()).toBe(false);

        // Not busy → loading hides
        await wrapper.setProps({ busy: false });
        expect(wrapper.find('.vc-list-loading').exists()).toBe(false);
    });

    it('renders Loading whenever busy when :overlay is set', async () => {
        const wrapper = withVuecs(() => h(VCList, {
            data: [{ id: 1, name: 'a' }] as User[],
            busy: true,
        }, { default: () => [h(VCListLoading, { overlay: true }, { default: () => '…' })] }));

        // Overlay mode shows even when data is present
        expect(wrapper.find('.vc-list-loading').exists()).toBe(true);

        await wrapper.setProps({ busy: false });
        expect(wrapper.find('.vc-list-loading').exists()).toBe(false);
    });

    it('folds :overlay into themeVariant so theme overlay variant activates', () => {
        const wrapper = withVuecs(() => h(VCList, {
            data: [{ id: 1, name: 'a' }] as User[],
            busy: true,
        }, { default: () => [h(VCListLoading, { overlay: true }, { default: () => '…' })] }), { themes: [{ elements: { listLoading: { variants: { overlay: { true: { root: 'cls-overlay' } } } } } }] });

        expect(wrapper.find('.vc-list-loading').classes()).toContain('cls-overlay');
    });
});

describe('Selection — v-model + ARIA', () => {
    const renderSelectableBody = (slotName: 'item' = 'item') => ({
        [slotName]: ({ data }: { data: User }) => h(
            VCListItem,
            { data, selectable: true },
            { default: () => data.name },
        ),
    });

    it('applies role="listbox" to VCListBody when selectionMode is set', () => {
        const wrapper = withVuecs(() => h(VCList, {
            data: [{ id: 1, name: 'a' }] as User[],
            selectionMode: 'multi',
        }, { default: () => [h(VCListBody, {}, renderSelectableBody())] }));

        const body = wrapper.find('.vc-list-body');
        expect(body.attributes('role')).toBe('listbox');
        expect(body.attributes('aria-multiselectable')).toBe('true');
    });

    it('applies role="option" + aria-selected to selectable items', () => {
        const wrapper = withVuecs(() => h(VCList, {
            data: [{ id: 1, name: 'a' }] as User[],
            selectionMode: 'single',
            selection: 1,
        }, { default: () => [h(VCListBody, {}, renderSelectableBody())] }));

        const item = wrapper.find('.vc-list-item');
        expect(item.attributes('role')).toBe('option');
        expect(item.attributes('aria-selected')).toBe('true');
    });

    it('emits update:selection on click (multi mode toggles in/out)', async () => {
        const wrapper = withVuecs(() => h(VCList, {
            data: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }] as User[],
            selectionMode: 'multi',
            selection: [],
        }, { default: () => [h(VCListBody, {}, renderSelectableBody())] }));

        await wrapper.findAll('.vc-list-item')[0]!.trigger('click');
        const list = wrapper.findComponent(VCList);
        const events = list.emitted('update:selection');
        expect(events).toBeTruthy();
        expect(events![0]).toEqual([[1]]);
    });

    it('skips selection toggle when click originates from a native interactive descendant', async () => {
        const wrapper = withVuecs(() => h(VCList, {
            data: [{ id: 1, name: 'a' }] as User[],
            selectionMode: 'multi',
            selection: [],
        }, {
            default: () => [h(VCListBody, {}, {
                item: ({ data }: { data: User }) => h(VCListItem, { data, selectable: true }, {
                    default: ({ classes }: { classes: { actions: string } }) => [
                        data.name,
                        h('span', { class: classes.actions }, h('button', { class: 'inner-btn' }, 'edit')),
                    ],
                }),
            })],
        }));

        await wrapper.find('.inner-btn').trigger('click');
        const list = wrapper.findComponent(VCList);
        expect(list.emitted('update:selection')).toBeFalsy();
    });
});

describe('Misuse / safety', () => {
    it('throws a helpful error when a part is used outside <VCList>', () => {
        const App = defineComponent({ setup: () => () => h(VCListBody) });
        expect(() => mount(App, {
            global: {
                plugins: [{
                    install(app: App) {
                        installThemeManager(app, {});
                        installDefaultsManager(app, {});
                        installConfigManager(app, {});
                    },
                }],
            },
        })).toThrow(/VCListBody.*VCList/);
    });
});
