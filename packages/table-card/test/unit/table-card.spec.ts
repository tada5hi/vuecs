// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { defineComponent, h, ref } from 'vue';
import type { Component } from 'vue';
import { mount } from '@vue/test-utils';
import type { PaginationMeta } from '@vuecs/pagination';
import type { TableSortState } from '@vuecs/table';
import vuecsTableCard, { VCTableCard } from '../../src';
import type { TableCardNoResultsSlotProps } from '../../src';

const plugins = [[vuecsTableCard, {}]] as const;

type User = { id: number; name: string };

const users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
];
const columns = [
    { key: 'id', label: 'ID' },
    {
        key: 'name', 
        label: 'Name', 
        sortable: true, 
    },
];

// The generic facade isn't structurally a `Component`; `mount` / `h` take the
// runtime value (identical at runtime).
const Card = VCTableCard as unknown as Component;

const mountCard = (
    props: Record<string, unknown> = {},
    slots: Record<string, unknown> = {},
) => mount(Card, {
    props: { columns, ...props },
    slots: slots as never,
    global: { plugins: [...plugins] },
    attachTo: document.body,
});

describe('<VCTableCard>', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    describe('header', () => {
        it('renders title and description inside the header', () => {
            const wrapper = mountCard({
                data: users,
                title: 'Users',
                description: 'Everyone with an account.',
            });
            const header = wrapper.find('.vc-table-card-header');

            expect(wrapper.element.classList.contains('vc-table-card')).toBe(true);
            expect(header.exists()).toBe(true);
            expect(header.find('.vc-table-card-title').text()).toBe('Users');
            expect(header.find('.vc-table-card-description').text()).toBe('Everyone with an account.');
        });

        it('renders no header band without title, description, search or actions', () => {
            const wrapper = mountCard({ data: users });

            expect(wrapper.find('.vc-table-card-header').exists()).toBe(false);
        });

        it('renders the search input only when `searchable`', () => {
            expect(mountCard({ data: users, title: 'Users' }).find('input').exists()).toBe(false);

            const wrapper = mountCard({ data: users, searchable: true });
            const input = wrapper.find('.vc-table-card-header input');

            expect(input.exists()).toBe(true);
            expect(input.attributes('type')).toBe('search');
            expect(input.classes()).toContain('vc-table-card-search');
            expect(input.attributes('placeholder')).toBe('Search…');
            expect(input.attributes('aria-label')).toBe('Search…');
        });

        it('uses the `searchPlaceholder` prop over the behavioral default', () => {
            const wrapper = mountCard({
                data: users,
                searchable: true,
                searchPlaceholder: 'Find users',
            });

            expect(wrapper.find('input').attributes('placeholder')).toBe('Find users');
        });

        it('emits `update:search` once after the 300ms debounce', async () => {
            vi.useFakeTimers();

            const wrapper = mountCard({ data: users, searchable: true });
            const input = wrapper.find('input');

            await input.setValue('al');
            await input.setValue('ali');
            expect(wrapper.emitted('update:search')).toBeUndefined();

            vi.advanceTimersByTime(299);
            expect(wrapper.emitted('update:search')).toBeUndefined();

            vi.advanceTimersByTime(1);
            expect(wrapper.emitted('update:search')).toEqual([['ali']]);
        });

        it('honors `searchDebounce`', async () => {
            const wrapper = mountCard({
                data: users,
                searchable: true,
                searchDebounce: 0,
            });

            await wrapper.find('input').setValue('bo');
            expect(wrapper.emitted('update:search')).toEqual([['bo']]);
        });

        it('reflects the bound `search` value in the input', () => {
            const wrapper = mountCard({
                data: users,
                searchable: true,
                search: 'bob',
            });

            expect((wrapper.find('input').element as HTMLInputElement).value).toBe('bob');
        });

        it('renders `#actions` inside the header toolbar', () => {
            const wrapper = mountCard(
                { data: users },
                { actions: () => h('button', { 'data-test-add': '' }, 'Add') },
            );

            expect(wrapper.find('.vc-table-card-header .vc-table-card-actions [data-test-add]').exists()).toBe(true);
        });
    });

    describe('states', () => {
        it('renders the table when there is data', () => {
            const wrapper = mountCard({ data: users });

            expect(wrapper.find('.vc-table-card-main table').exists()).toBe(true);
            expect(wrapper.findAll('tbody tr').length).toBe(2);
            expect(wrapper.find('.vc-empty-state').exists()).toBe(false);
        });

        it('`busy` renders the table with placeholder rows and no empty state', () => {
            const wrapper = mountCard({ data: users, busy: true });

            expect(wrapper.find('table').attributes('aria-busy')).toBe('true');
            expect(wrapper.find('tbody.vc-table-placeholder-body').exists()).toBe(true);
            expect(wrapper.find('.vc-empty-state').exists()).toBe(false);
        });

        it('`busy` wins over an empty `data` (first load shows skeletons)', () => {
            const wrapper = mountCard({ data: [], busy: true });

            expect(wrapper.find('tbody.vc-table-placeholder-body').exists()).toBe(true);
            expect(wrapper.find('.vc-empty-state').exists()).toBe(false);
        });

        it('empty state never flashes across busy -> empty -> busy', async () => {
            const wrapper = mountCard({ data: [], busy: true });

            expect(wrapper.find('.vc-empty-state').exists()).toBe(false);

            await wrapper.setProps({ busy: false });
            expect(wrapper.find('.vc-empty-state').exists()).toBe(true);

            await wrapper.setProps({ busy: true });
            expect(wrapper.find('.vc-empty-state').exists()).toBe(false);
            expect(wrapper.find('tbody.vc-table-placeholder-body').exists()).toBe(true);
        });

        it('not busy + no data replaces the whole table with the `empty` state', () => {
            const wrapper = mountCard({ data: [] });
            const empty = wrapper.find('.vc-table-card-main .vc-empty-state');

            expect(empty.exists()).toBe(true);
            expect(wrapper.findComponent({ name: 'VCEmptyState' }).props('variant')).toBe('empty');
            expect(wrapper.find('table').exists()).toBe(false);
        });

        it('the built-in `empty` state shows the `emptyTitle` default', () => {
            const wrapper = mountCard({ data: [] });

            expect(wrapper.find('.vc-empty-state-title').text()).toBe('No entries yet');
        });

        it('app-level defaults override `emptyTitle`', () => {
            const wrapper = mount(Card, {
                props: { columns, data: [] },
                global: { plugins: [[vuecsTableCard, { defaults: { tableCard: { emptyTitle: 'Noch keine Einträge' } } }]] },
            });

            expect(wrapper.find('.vc-empty-state-title').text()).toBe('Noch keine Einträge');
        });

        it('`filtered` + no data renders `noResults`; its action emits `reset`', async () => {
            const wrapper = mountCard({ data: [], filtered: true });
            const empty = wrapper.find('.vc-empty-state');

            expect(wrapper.findComponent({ name: 'VCEmptyState' }).props('variant')).toBe('noResults');
            expect(wrapper.find('table').exists()).toBe(false);

            await empty.find('button').trigger('click');
            expect(wrapper.emitted('reset')).toEqual([[]]);
        });

        it('`#empty` slot overrides the built-in empty state', () => {
            const wrapper = mountCard(
                { data: [] },
                { empty: () => h('p', { 'data-test-empty': '' }, 'Nothing here') },
            );

            expect(wrapper.find('[data-test-empty]').exists()).toBe(true);
            expect(wrapper.find('.vc-empty-state').exists()).toBe(false);
        });

        it('`#noResults` slot overrides the built-in state and receives `reset`', async () => {
            const wrapper = mountCard(
                { data: [], filtered: true },
                {
                    noResults: ({ reset }: TableCardNoResultsSlotProps) => h('button', {
                        'data-test-reset': '',
                        onClick: reset,
                    }, 'Clear'),
                },
            );

            expect(wrapper.find('.vc-empty-state').exists()).toBe(false);
            await wrapper.find('[data-test-reset]').trigger('click');
            expect(wrapper.emitted('reset')).toEqual([[]]);
        });
    });

    describe('table passthrough', () => {
        it('forwards `cell-<key>` slots with the row', () => {
            const wrapper = mountCard(
                { data: users },
                { 'cell-name': ({ row }: { row: User }) => h('b', { 'data-test-cell': '' }, row.name.toUpperCase()) },
            );
            const cells = wrapper.findAll('[data-test-cell]');

            expect(cells.map((c) => c.text())).toEqual(['ALICE', 'BOB']);
        });

        it('forwards `@row-click` to the table with the row', async () => {
            const onRowClick = vi.fn();
            const wrapper = mountCard({
                data: users,
                rowClickable: true,
                onRowClick,
            });

            await wrapper.findAll('tbody tr')[1]!.trigger('click');
            expect(onRowClick).toHaveBeenCalledTimes(1);
            expect(onRowClick.mock.calls[0]![0]).toEqual(users[1]);
            expect(onRowClick.mock.calls[0]![1]).toBe(1);
        });

        it('keeps `class` / `style` on the card root, not the table', () => {
            const wrapper = mountCard({
                data: users,
                class: 'custom-card',
                style: 'margin-top: 3px;',
                'data-test-table': '',
            });

            expect(wrapper.element.classList.contains('custom-card')).toBe(true);
            expect(wrapper.element.classList.contains('vc-table-card')).toBe(true);
            expect((wrapper.element as HTMLElement).style.marginTop).toBe('3px');
            expect(wrapper.find('table').classes()).not.toContain('custom-card');
            expect(wrapper.find('table').attributes()).toHaveProperty('data-test-table');
            expect(wrapper.element.hasAttribute('data-test-table')).toBe(false);
        });

        it('forwards table options so `#expansion` renders', () => {
            const wrapper = mountCard(
                {
                    data: users,
                    expandable: true,
                    expanded: [2],
                },
                { expansion: ({ row }: { row: User }) => h('p', { 'data-test-expansion': '' }, `detail ${row.name}`) },
            );
            const panels = wrapper.findAll('[data-test-expansion]');

            expect(panels.map((p) => p.text())).toEqual(['detail Bob']);
        });

        it('applies `themeClass` overrides', () => {
            const wrapper = mountCard({
                data: [],
                title: 'Users',
                themeClass: { root: 'my-root', main: 'my-main' },
            });

            expect(wrapper.element.classList.contains('my-root')).toBe(true);
            expect(wrapper.find('.my-main .vc-empty-state').exists()).toBe(true);
        });

        it('round-trips `v-model:sort`', async () => {
            const Host = defineComponent({
                setup() {
                    const sort = ref<TableSortState>([]);

                    return () => h(Card, {
                        data: users,
                        columns,
                        sort: sort.value,
                        'onUpdate:sort': (value: TableSortState) => {
                            sort.value = value;
                        },
                    });
                },
            });
            const wrapper = mount(Host, { global: { plugins: [...plugins] } });
            const header = wrapper.findAll('th').find((th) => th.text().includes('Name'))!;

            expect(header.attributes('aria-sort')).toBe('none');
            await header.trigger('click');
            expect(header.attributes('aria-sort')).toBe('ascending');
            await header.trigger('click');
            expect(header.attributes('aria-sort')).toBe('descending');
        });
    });

    describe('pagination', () => {
        it('is hidden when `total <= limit`', () => {
            const wrapper = mountCard({
                data: users,
                total: 2,
                limit: 10,
            });

            expect(wrapper.find('.vc-pagination').exists()).toBe(false);
            expect(wrapper.find('.vc-table-card-footer').exists()).toBe(false);
        });

        it('is shown in the footer when `total > limit`', () => {
            const wrapper = mountCard({
                data: users,
                total: 50,
                limit: 10,
            });

            expect(wrapper.find('.vc-table-card-footer .vc-pagination').exists()).toBe(true);
        });

        it('re-emits the pagination `load` payload as `page`', async () => {
            const wrapper = mountCard({
                data: users,
                total: 50,
                limit: 10,
                offset: 0,
            });
            const pageTwo = wrapper.findAll('button[data-type="page"]').find((b) => b.text().trim() === '2')!;

            await pageTwo.trigger('click');

            const [[meta]] = wrapper.emitted('page') as [[PaginationMeta]];

            expect(meta.page).toBe(2);
            expect(meta.offset).toBe(10);
            expect(meta.limit).toBe(10);
        });
    });

    describe('aside', () => {
        it('renders `#aside` in the aside wrapper next to the main wrapper', () => {
            const wrapper = mountCard(
                { data: users },
                { aside: () => h('div', { 'data-test-aside': '' }, 'Filters') },
            );
            const body = wrapper.find('.vc-table-card-body');
            const children = Array.from(body.element.children);

            expect(children.map((c) => c.className)).toEqual([
                expect.stringContaining('vc-table-card-main'),
                expect.stringContaining('vc-table-card-aside'),
            ]);
            expect(body.find('.vc-table-card-aside [data-test-aside]').exists()).toBe(true);
        });

        it('renders no aside wrapper without the slot', () => {
            const wrapper = mountCard({ data: users });

            expect(wrapper.find('.vc-table-card-aside').exists()).toBe(false);
        });
    });
});
