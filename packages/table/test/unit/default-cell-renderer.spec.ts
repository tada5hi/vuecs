// @vitest-environment jsdom
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest';
import { Fragment, defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsTable, {
    VCTable,
    VCTableBody,
    VCTableCell,
    VCTableHeader,
    VCTableRow,
} from '../../src';

const plugins = [[vuecsTable, {}]] as const;

type User = {
    id: number; 
    name: string; 
    profile: { email: string } 
};

const data: User[] = [
    {
        id: 1, 
        name: 'Alice', 
        profile: { email: 'alice@example.com' }, 
    },
    {
        id: 2, 
        name: 'Bob', 
        profile: { email: 'bob@example.com' }, 
    },
];

function mountTable(opts: {
    columns?: unknown; 
    cellSlot?: () => unknown; 
    cellAttrs?: Record<string, unknown> 
} = {}) {
    return mount(defineComponent({
        setup() {
            return () => h(VCTable, { columns: opts.columns as never, data: data as never }, {
                default: () => [
                    h(VCTableHeader),
                    h(VCTableBody, null, {
                        default: () => data.map((row) => h(VCTableRow, { row, index: data.indexOf(row) }, {
                            default: () => [
                                h(VCTableCell, { columnKey: 'id', ...opts.cellAttrs }, opts.cellSlot && opts.cellAttrs?.columnKey === 'id' ? { default: opts.cellSlot } : undefined),
                                h(VCTableCell, { columnKey: 'name', ...opts.cellAttrs }, opts.cellSlot && opts.cellAttrs?.columnKey === 'name' ? { default: opts.cellSlot } : undefined),
                            ],
                        })),
                    }),
                ],
            });
        },
    }), { global: { plugins: [...plugins] } });
}

describe('<VCTableCell> default renderer', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders row[columnKey] when no accessor / formatter / slot', () => {
        const wrapper = mountTable({ columns: [{ key: 'id' }, { key: 'name' }] });
        const cells = wrapper.element.querySelectorAll('tbody td');
        expect(cells[0].textContent).toBe('1');
        expect(cells[1].textContent).toBe('Alice');
        expect(cells[2].textContent).toBe('2');
        expect(cells[3].textContent).toBe('Bob');
    });

    it('renders empty string for null / undefined values', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }, { key: 'missing' }] as never,
                    data: [{ name: 'Alice', missing: null }, { name: 'Bob', missing: undefined }] as never,
                }, {
                    default: () => [
                        h(VCTableHeader),
                        h(VCTableBody, null, {
                            default: () => [
                                h(VCTableRow, { row: { name: 'Alice', missing: null }, index: 0 }, {
                                    default: () => [
                                        h(VCTableCell, { columnKey: 'name' }),
                                        h(VCTableCell, { columnKey: 'missing' }),
                                    ],
                                }),
                                h(VCTableRow, { row: { name: 'Bob', missing: undefined }, index: 1 }, {
                                    default: () => [
                                        h(VCTableCell, { columnKey: 'name' }),
                                        h(VCTableCell, { columnKey: 'missing' }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const cells = wrapper.element.querySelectorAll('tbody td');
        expect(cells[0].textContent).toBe('Alice');
        expect(cells[1].textContent).toBe('');
        expect(cells[2].textContent).toBe('Bob');
        expect(cells[3].textContent).toBe('');
    });

    it('honors string-accessor dot-path', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [
                        { key: 'name' },
                        { key: 'email', accessor: 'profile.email' },
                    ] as never,
                    data: data as never,
                }, {
                    default: () => [
                        h(VCTableHeader),
                        h(VCTableBody, null, {
                            default: () => data.map((row) => h(VCTableRow, { row, index: data.indexOf(row) }, {
                                default: () => [
                                    h(VCTableCell, { columnKey: 'name' }),
                                    h(VCTableCell, { columnKey: 'email' }),
                                ],
                            })),
                        }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const cells = wrapper.element.querySelectorAll('tbody td');
        expect(cells[0].textContent).toBe('Alice');
        expect(cells[1].textContent).toBe('alice@example.com');
        expect(cells[2].textContent).toBe('Bob');
        expect(cells[3].textContent).toBe('bob@example.com');
    });

    it('honors function-accessor', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [
                        { key: 'name' },
                        { key: 'shouty', accessor: (r: User) => r.name.toUpperCase() },
                    ] as never,
                    data: data as never,
                }, {
                    default: () => [
                        h(VCTableHeader),
                        h(VCTableBody, null, {
                            default: () => data.map((row) => h(VCTableRow, { row, index: data.indexOf(row) }, {
                                default: () => [
                                    h(VCTableCell, { columnKey: 'name' }),
                                    h(VCTableCell, { columnKey: 'shouty' }),
                                ],
                            })),
                        }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const cells = wrapper.element.querySelectorAll('tbody td');
        expect(cells[1].textContent).toBe('ALICE');
        expect(cells[3].textContent).toBe('BOB');
    });

    it('runs formatter on the resolved value', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [
                        { key: 'id', formatter: (ctx: { value: unknown }) => `#${ctx.value}` },
                        { key: 'name', formatter: (ctx: { value: unknown }) => `Mr ${ctx.value}` },
                    ] as never,
                    data: data as never,
                }, {
                    default: () => [
                        h(VCTableHeader),
                        h(VCTableBody, null, {
                            default: () => data.map((row) => h(VCTableRow, { row, index: data.indexOf(row) }, {
                                default: () => [
                                    h(VCTableCell, { columnKey: 'id' }),
                                    h(VCTableCell, { columnKey: 'name' }),
                                ],
                            })),
                        }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        const cells = wrapper.element.querySelectorAll('tbody td');
        expect(cells[0].textContent).toBe('#1');
        expect(cells[1].textContent).toBe('Mr Alice');
    });

    it('formatter receives { value, key, row }', () => {
        let ctxSeen: unknown;
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [
                        {
                            key: 'name',
                            formatter: (ctx) => {
                                ctxSeen = ctx;
                                return String(ctx.value);
                            },
                        },
                    ] as never,
                    data: data as never,
                }, {
                    default: () => [
                        h(VCTableHeader),
                        h(VCTableBody, null, { default: () => [h(VCTableRow, { row: data[0], index: 0 }, { default: () => [h(VCTableCell, { columnKey: 'name' })] })] }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });

        expect(ctxSeen).toEqual({
            value: 'Alice', 
            key: 'name', 
            row: data[0], 
        });
        wrapper.unmount();
    });

    it('honors Fragment-wrapped slot content (e.g. template v-if / v-for)', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [
                        { key: 'name', formatter: () => 'AUTO' },
                    ] as never,
                    data: data as never,
                }, {
                    default: () => [
                        h(VCTableHeader),
                        h(VCTableBody, null, {
                            default: () => [h(VCTableRow, { row: data[0], index: 0 }, {
                                default: () => [
                                    h(VCTableCell, { columnKey: 'name' }, { default: () => [h(Fragment, null, ['FRAGMENT'])] }),
                                ],
                            })],
                        }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });
        // Without Fragment-aware walk the cell would render 'AUTO'.
        expect(wrapper.element.querySelector('tbody td')!.textContent).toBe('FRAGMENT');
    });

    it('consumer slot content overrides the default renderer', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [
                        { key: 'name', formatter: () => 'AUTO' },
                    ] as never,
                    data: data as never,
                }, {
                    default: () => [
                        h(VCTableHeader),
                        h(VCTableBody, null, {
                            default: () => [h(VCTableRow, { row: data[0], index: 0 }, {
                                default: () => [
                                    h(VCTableCell, { columnKey: 'name' }, { default: () => 'CUSTOM' }),
                                ],
                            })],
                        }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });
        expect(wrapper.element.querySelector('tbody td')!.textContent).toBe('CUSTOM');
    });

    it('does NOT auto-render when columnKey is not in the columns array', () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(VCTable, {
                    columns: [{ key: 'name' }] as never,
                    data: data as never,
                }, {
                    default: () => [
                        h(VCTableHeader),
                        h(VCTableBody, null, {
                            default: () => [h(VCTableRow, { row: data[0], index: 0 }, {
                                default: () => [
                                    h(VCTableCell, { columnKey: 'unknown' }),
                                ],
                            })],
                        }),
                    ],
                });
            },
        }), { global: { plugins: [...plugins] } });
        // No matching column → no auto-render → empty cell.
        expect(wrapper.element.querySelector('tbody td')!.textContent).toBe('');
    });

    it('renders empty when mounted outside a <VCTable> context (no fallback render)', () => {
        // Standalone <VCTableCell> with no parent table — should not throw,
        // just render empty.
        const wrapper = mount(defineComponent({
            setup() {
                return () => h('table', null, [h('tbody', null, [h('tr', null, [
                    h(VCTableCell, { columnKey: 'name' }),
                ])])]);
            },
        }), { global: { plugins: [...plugins] } });
        expect(wrapper.element.querySelector('td')!.textContent).toBe('');
    });
});
