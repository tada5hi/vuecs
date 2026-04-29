// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import type { App } from 'vue';
import { mount } from '@vue/test-utils';
import { installConfigManager, installDefaultsManager, installThemeManager } from '@vuecs/core';
import {
    VCList,
    VCListBody,
    VCListHeader,
    VCListItem,
    VCListLoading,
    VCListNoMore,
} from '../../src';

type User = { id: number; name: string };

function withVuecs(setup: () => unknown) {
    const App = defineComponent({ setup: () => setup });
    return mount(App, {
        global: {
            plugins: [{
                install(app: App) {
                    installThemeManager(app, {});
                    installDefaultsManager(app, {});
                    installConfigManager(app, {});
                },
            }],
        },
    });
}

describe('VCList — mode dispatch', () => {
    it('renders shorthand mode when no compound children are present', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, { item: ({ data }: { data: User }) => h('div', { class: 'row' }, data.name) }));

        expect(wrapper.findAll('.row').length).toBe(1);
        expect(wrapper.find('.row').text()).toBe('a');
        expect(wrapper.find('.vc-list').exists()).toBe(true);
        expect(wrapper.find('.vc-list-body').exists()).toBe(true);
    });

    it('renders compound mode when default-slot vnodes are present', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }, { id: 2, name: 'b' }] as User[] }, {
            default: () => [
                h(VCListBody, {}, { item: ({ data }: { data: User }) => h('div', { class: 'compound-row' }, data.name) }),
            ],
        }));

        expect(wrapper.findAll('.compound-row').length).toBe(2);
        expect(wrapper.find('.vc-list').exists()).toBe(true);
        expect(wrapper.find('.vc-list-header').exists()).toBe(false);
        expect(wrapper.find('.vc-list-footer').exists()).toBe(false);
    });

    it('emits the auto-composed parts in shorthand mode (header, body, footer)', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, {
            header: () => h('span', { class: 'h' }, 'H'),
            item: ({ data }: { data: User }) => h('div', { class: 'row' }, data.name),
            footer: () => h('span', { class: 'f' }, 'F'),
        }));

        expect(wrapper.find('.vc-list-header').exists()).toBe(true);
        expect(wrapper.find('.vc-list-header .h').text()).toBe('H');
        expect(wrapper.find('.vc-list-footer .f').text()).toBe('F');
        expect(wrapper.findAll('.row').length).toBe(1);
    });

    it('honors the asChild prop in compound mode by cloning the single child', () => {
        const wrapper = withVuecs(() => h(VCList, {
            asChild: true,
            data: [] as User[],
        }, { default: () => [h('section', { class: 'as-child-root' }, 'X')] }));

        const root = wrapper.element as HTMLElement;
        expect(root.tagName).toBe('SECTION');
        expect(root.className).toContain('as-child-root');
        expect(root.className).toContain('vc-list');
    });
});

describe('VCListBody — iteration modes', () => {
    it('auto-iterates `data` and provides per-row slot props', () => {
        const wrapper = withVuecs(() => h(VCList, {
            data: [
                { id: 1, name: 'a' },
                { id: 2, name: 'b' },
                { id: 3, name: 'c' },
            ] as User[],
        }, {
            default: () => [
                h(VCListBody, {}, {
                    item: ({ data, index }: { data: User; index: number }) =>
                        h('div', { class: 'row', 'data-index': index }, data.name),
                }),
            ],
        }));

        const rows = wrapper.findAll('.row');
        expect(rows.length).toBe(3);
        expect(rows[0].text()).toBe('a');
        expect(rows[2].attributes('data-index')).toBe('2');
    });

    it('keys rows by `itemKey` when provided', async () => {
        const data = ref<User[]>([
            { id: 1, name: 'a' },
            { id: 2, name: 'b' },
        ]);
        const wrapper = withVuecs(() => h(VCList, {
            data: data.value,
            itemKey: 'id',
        }, {
            default: () => [
                h(VCListBody, {}, { item: ({ data: row }: { data: User }) => h('div', { class: 'row' }, row.name) }),
            ],
        }));

        expect(wrapper.findAll('.row').map((r) => r.text())).toEqual(['a', 'b']);
    });

    it('renders manual mode when default slot supplies content', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, {
            default: () => [
                h(VCListBody, {}, { default: () => [h('div', { class: 'manual' }, 'custom')] }),
            ],
        }));

        expect(wrapper.find('.manual').exists()).toBe(true);
        expect(wrapper.find('.manual').text()).toBe('custom');
    });

    it('renders an empty wrapper when no item slot and no default slot are given', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, { default: () => [h(VCListBody)] }));

        const body = wrapper.find('.vc-list-body');
        expect(body.exists()).toBe(true);
        expect(body.element.children.length).toBe(0);
    });
});

describe('VCListLoading / VCListNoMore — self-conditioning', () => {
    it('renders Loading only while busy is true', async () => {
        const busy = ref(true);
        const wrapper = withVuecs(() => h(VCList, {
            data: [],
            busy: busy.value,
        }, {
            default: () => [
                h(VCListLoading, {}, { default: () => 'loading…' }),
            ],
        }));

        expect(wrapper.find('.vc-list-loading').exists()).toBe(true);
        expect(wrapper.text()).toContain('loading…');

        busy.value = false;
        await wrapper.setProps({ busy: false });
        expect(wrapper.find('.vc-list-loading').exists()).toBe(false);
    });

    it('renders NoMore only when the list has settled with zero rows', () => {
        const empty = withVuecs(() => h(VCList, {
            data: [],
            busy: false,
        }, { default: () => [h(VCListNoMore, {}, { default: () => 'empty' })] }));
        expect(empty.find('.vc-list-no-more').exists()).toBe(true);
        expect(empty.text()).toContain('empty');

        const populated = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, { default: () => [h(VCListNoMore, {}, { default: () => 'empty' })] }));
        expect(populated.find('.vc-list-no-more').exists()).toBe(false);
    });

    it('falls back to the global default content when NoMore has no slot', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [] }, { default: () => [h(VCListNoMore)] }));

        const noMore = wrapper.find('.vc-list-no-more');
        expect(noMore.exists()).toBe(true);
        expect(noMore.text().length).toBeGreaterThan(0);
    });
});

describe('VCListHeader / VCListFooter / VCListItem', () => {
    it('VCListItem layout-slot mode emits per-slot wrapper divs', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, {
            default: () => [
                h(VCListBody, {}, {
                    item: ({ data }: { data: User }) => h(VCListItem, { data }, {
                        text: ({ data: row }: { data: User }) => row.name,
                        actions: () => h('button', { class: 'edit-btn' }, 'edit'),
                    }),
                }),
            ],
        }));

        expect(wrapper.find('.vc-list-item').exists()).toBe(true);
        expect(wrapper.find('.vc-list-item-text').text()).toBe('a');
        expect(wrapper.find('.vc-list-item-actions .edit-btn').exists()).toBe(true);
        expect(wrapper.find('.vc-list-item-actions-extra').exists()).toBe(false);
    });

    it('VCListItem default slot wins over layout slots', () => {
        const wrapper = withVuecs(() => h(VCList, { data: [{ id: 1, name: 'a' }] as User[] }, {
            default: () => [
                h(VCListBody, {}, { item: ({ data }: { data: User }) => h(VCListItem, { data }, { default: ({ data: row }: { data: User }) => h('span', { class: 'custom' }, row.name) }) }),
            ],
        }));

        expect(wrapper.find('.vc-list-item .custom').text()).toBe('a');
        expect(wrapper.find('.vc-list-item-text').exists()).toBe(false);
    });

    it('VCListHeader / VCListFooter render only when their default slot is provided', () => {
        const a = withVuecs(() => h(VCList, { data: [] }, { default: () => [h(VCListHeader)] }));
        // empty wrapper still renders — themes hide it via :empty
        expect(a.find('.vc-list-header').exists()).toBe(true);
        expect(a.find('.vc-list-header').element.children.length).toBe(0);

        const b = withVuecs(() => h(VCList, { data: [] }, { default: () => [h(VCListHeader, {}, { default: () => h('span', { class: 'hh' }, 'H') })] }));
        expect(b.find('.vc-list-header .hh').text()).toBe('H');
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
