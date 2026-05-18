// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsTable, {
    VCTable,
    VCTableBody,
    VCTableCell,
    VCTableEmpty,
    VCTableFooter,
    VCTableHeadCell,
    VCTableHeader,
    VCTableRow,
} from '../../src';

const plugins = [[vuecsTable, {}]] as const;

type User = { id: number; name: string };

const data: User[] = [
    {
        id: 1,
        name: 'Alice',
    },
    {
        id: 2,
        name: 'Bob',
    },
];

const columns = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'name',
        label: 'Name',
        sortable: true,
    },
];

describe('<VCTable> driver auto-render (plan 033 v0.2-B)', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders header + body automatically with no default slot', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: columns as never, data: data as never });
            },
        }), { global: { plugins: [...plugins] } });

        const root = wrapper.element;
        expect(root.querySelectorAll('thead').length).toBe(1);
        expect(root.querySelectorAll('tbody').length).toBe(1);

        const headers = root.querySelectorAll('thead th');
        expect(headers.length).toBe(2);
        expect(headers[0].textContent?.trim()).toBe('ID');
        expect(headers[1].textContent?.trim()).toBe('Name');

        const bodyRows = root.querySelectorAll('tbody tr');
        expect(bodyRows.length).toBe(2);

        const firstRowCells = bodyRows[0].querySelectorAll('td');
        expect(firstRowCells[0].textContent).toBe('1');
        expect(firstRowCells[1].textContent).toBe('Alice');
    });

    it('honors a consumer-provided <VCTableHeader> and auto-renders only the body', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: columns as never, data: data as never }, {
                    default: () => [
                        h(VCTableHeader, null, () => h(VCTableRow, null, () => [
                            h(VCTableHeadCell, { columnKey: 'id' }, () => 'Custom ID'),
                            h(VCTableHeadCell, { columnKey: 'name' }, () => 'Custom Name'),
                        ])),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const headers = wrapper.element.querySelectorAll('thead th');
        expect(headers[0].textContent?.trim()).toBe('Custom ID');
        expect(headers[1].textContent?.trim()).toBe('Custom Name');

        const bodyRows = wrapper.element.querySelectorAll('tbody tr');
        expect(bodyRows.length).toBe(2);
        expect(bodyRows[0].querySelectorAll('td')[0].textContent).toBe('1');
    });

    it('honors a consumer-provided <VCTableBody> and auto-renders only the header', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: columns as never, data: data as never }, {
                    default: () => [
                        h(VCTableBody, null, {
                            row: ({ row }: { row: User }) => h(VCTableRow, { row }, () => [
                                h(VCTableCell, { columnKey: 'name' }, () => `manual:${row.name}`),
                            ]),
                        }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const headers = wrapper.element.querySelectorAll('thead th');
        expect(headers.length).toBe(2);
        expect(headers[0].textContent?.trim()).toBe('ID');

        const bodyCells = wrapper.element.querySelectorAll('tbody td');
        expect(bodyCells[0].textContent).toBe('manual:Alice');
        expect(bodyCells[1].textContent).toBe('manual:Bob');
    });

    it('does NOT auto-render anything when both header and body are provided manually', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: columns as never, data: data as never }, {
                    default: () => [
                        h(VCTableHeader, null, () => h(VCTableRow, null, () => [
                            h(VCTableHeadCell, null, () => 'HDR'),
                        ])),
                        h(VCTableBody, null, {
                            row: ({ row }: { row: User }) => h(VCTableRow, { row }, () => [
                                h(VCTableCell, null, () => `R:${row.id}`),
                            ]),
                        }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        expect(wrapper.element.querySelectorAll('thead').length).toBe(1);
        expect(wrapper.element.querySelectorAll('tbody').length).toBe(1);
        const headerCells = wrapper.element.querySelectorAll('thead th');
        expect(headerCells.length).toBe(1);
        expect(headerCells[0].textContent?.trim()).toBe('HDR');
    });

    it('does NOT auto-render when :columns is explicitly []', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: [] as never, data: data as never });
            },
        }), { global: { plugins: [...plugins] } });

        // Explicit [] is authoritative — consumers signalling "no columns".
        expect(wrapper.element.querySelectorAll('thead').length).toBe(0);
        expect(wrapper.element.querySelectorAll('tbody').length).toBe(0);
    });

    it('auto-derives columns from data[0] keys when :columns is unset', () => {
        const wrapper = mount(defineComponent({
            setup() {
                // No :columns → normalizeColumns derives from Object.keys(data[0]).
                return () => h(VCTable, { data: data as never });
            },
        }), { global: { plugins: [...plugins] } });

        const headers = wrapper.element.querySelectorAll('thead th');
        expect(headers.length).toBe(2);
        // startCase('id') → 'Id', startCase('name') → 'Name'.
        expect(headers[0].textContent?.trim()).toBe('Id');
        expect(headers[1].textContent?.trim()).toBe('Name');

        const bodyRows = wrapper.element.querySelectorAll('tbody tr');
        expect(bodyRows.length).toBe(2);
    });

    it('renders auto header + body alongside a consumer-supplied <VCTableEmpty>', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: columns as never, data: [] }, { default: () => [h(VCTableEmpty, null, () => 'No data.')] });
            },
        }), { global: { plugins: [...plugins] } });

        const tbodies = wrapper.element.querySelectorAll('tbody');
        // Auto-body returns null when data is empty, so only the Empty
        // band's <tbody> ends up in the DOM. The header still auto-renders.
        expect(wrapper.element.querySelectorAll('thead').length).toBe(1);
        expect(tbodies.length).toBe(1);
        expect(tbodies[0].textContent).toContain('No data.');
    });

    it('does NOT leak `is-row-header` as an HTML attribute on auto-rendered <th> elements', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: columns as never, data: data as never });
            },
        }), { global: { plugins: [...plugins] } });

        const ths = wrapper.element.querySelectorAll('thead th');
        for (const th of ths) {
            expect(th.hasAttribute('is-row-header')).toBe(false);
        }
    });

    it('forwards per-column class / headerClass / cellClass / stickyColumn / headerTitle / headerAbbr', () => {
        const richCols = [
            {
                key: 'name',
                label: 'Name',
                class: 'shared-class',
                headerClass: 'h-class',
                cellClass: 'c-class',
                stickyColumn: true,
                headerTitle: 'name title',
                headerAbbr: 'name abbr',
            },
        ];
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: richCols as never,
                    data: [{ name: 'Alice' }] as never,
                });
            },
        }), { global: { plugins: [...plugins] } });

        const th = wrapper.element.querySelector('thead th') as HTMLTableCellElement;
        expect(th.classList.contains('shared-class')).toBe(true);
        expect(th.classList.contains('h-class')).toBe(true);
        expect(th.classList.contains('c-class')).toBe(false);
        expect(th.title).toBe('name title');
        expect(th.abbr).toBe('name abbr');
        expect(th.hasAttribute('data-sticky-column')).toBe(true);

        const td = wrapper.element.querySelector('tbody td') as HTMLTableCellElement;
        expect(td.classList.contains('shared-class')).toBe(true);
        expect(td.classList.contains('c-class')).toBe(true);
        expect(td.classList.contains('h-class')).toBe(false);
        expect(td.hasAttribute('data-sticky-column')).toBe(true);
    });

    it('renders <th scope="row"> for body cells when column.isRowHeader is set', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name', isRowHeader: true }] as never,
                    data: [{ name: 'Alice' }] as never,
                });
            },
        }), { global: { plugins: [...plugins] } });

        const cell = wrapper.element.querySelector('tbody tr > *');
        expect(cell?.tagName).toBe('TH');
        expect(cell?.getAttribute('scope')).toBe('row');
    });

    it('places a manual <VCTableFooter> AFTER the auto-rendered <tbody> (HTML5 table band order)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: columns as never, data: data as never }, {
                    default: () => [
                        h(VCTableFooter, null, () => h('tr', null, [h('td', null, 'FOOTER')])),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const table = wrapper.element.querySelector('table');
        const sections = Array.from(table?.children ?? []).map((el) => el.tagName);
        // Expected order: THEAD, TBODY, TFOOT (regardless of slot order).
        const theadIdx = sections.indexOf('THEAD');
        const tbodyIdx = sections.indexOf('TBODY');
        const tfootIdx = sections.indexOf('TFOOT');
        expect(theadIdx).toBeLessThan(tbodyIdx);
        expect(tbodyIdx).toBeLessThan(tfootIdx);
    });

    it('detects Fragment-wrapped <VCTableHeader> (e.g. template v-if)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, { columns: columns as never, data: data as never }, {
                    default: () => [
                        // Simulate `<template v-if="true">` producing a Fragment
                        // wrapping the consumer's header.
                        [h(VCTableHeader, null, () => h(VCTableRow, null, () => [
                            h(VCTableHeadCell, null, () => 'WRAPPED'),
                        ]))],
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        // Auto-header should NOT fire because containsComponent recurses
        // into the array (Fragment-ish) and finds the manual VCTableHeader.
        expect(wrapper.element.querySelectorAll('thead').length).toBe(1);
        const headerCells = wrapper.element.querySelectorAll('thead th');
        expect(headerCells.length).toBe(1);
        expect(headerCells[0].textContent?.trim()).toBe('WRAPPED');
    });
});
