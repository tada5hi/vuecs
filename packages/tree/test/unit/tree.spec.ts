// @vitest-environment jsdom
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import vuecsTree, { VCTree } from '../../src';

const plugins = [[vuecsTree, {}]] as const;

type Node = {
    id: string,
    label: string,
    children?: Node[]
};

// users
// ├ users/employees
// └ users/admins
// sources
const TREE: Node[] = [
    {
        id: 'users',
        label: 'users',
        children: [
            { id: 'users/employees', label: 'employees' },
            { id: 'users/admins', label: 'admins' },
        ],
    },
    { id: 'sources', label: 'sources' },
];

const mountTree = (props: Record<string, unknown> = {}) => mount(VCTree as never, {
    props: { items: TREE, ...props },
    global: { plugins: plugins as never },
});

const rowKeys = (wrapper: ReturnType<typeof mountTree>) => wrapper
    .findAll('[role="treeitem"]')
    .map((row) => row.attributes('data-key'));

describe('VCTree rendering', () => {
    it('renders a tree role on the root and a treeitem per visible row', () => {
        const wrapper = mountTree();

        expect(wrapper.find('[role="tree"]').exists()).toBe(true);
        expect(rowKeys(wrapper)).toEqual(['users', 'sources']);
    });

    it('renders descendants only once their parent is expanded', async () => {
        const wrapper = mountTree({ defaultExpanded: ['users'] });
        await nextTick();

        expect(rowKeys(wrapper)).toEqual(['users', 'users/employees', 'users/admins', 'sources']);
    });

    it('exposes the depth as a --vc-tree-level custom property', async () => {
        const wrapper = mountTree({ defaultExpanded: ['users'] });
        await nextTick();

        const rows = wrapper.findAll('[role="treeitem"]');

        expect(rows[0].attributes('style')).toContain('--vc-tree-level: 1');
        expect(rows[1].attributes('style')).toContain('--vc-tree-level: 2');
    });

    it('renders the empty slot when there are no items', () => {
        const wrapper = mount(VCTree as never, {
            props: { items: [] },
            slots: { empty: '<span class="none">nothing here</span>' },
            global: { plugins: plugins as never },
        });

        expect(wrapper.find('.none').exists()).toBe(true);
    });
});

// Reka's TreeRoot computes `selectedKeys` as `[getKey(modelValue ?? {})]` in
// single-select mode, so it calls our key resolver with a literal `{}` on
// every render. A consumer resolver that dereferences would throw at mount.
describe('VCTree key resolution', () => {
    it('never routes a phantom object through the consumer key resolver', () => {
        const itemId = vi.fn((item: Node) => item.id.toString());

        expect(() => mountTree({ itemId })).not.toThrow();

        for (const [arg] of itemId.mock.calls) {
            expect(arg).toHaveProperty('id');
        }
    });

    it('resolves keys through itemKey when given', () => {
        const wrapper = mountTree({ itemKey: 'label' });

        expect(rowKeys(wrapper)).toEqual(['users', 'sources']);
    });
});

// The whole design rests on reka's Slot doing `mergeProps(attrs, child.props)`
// — child last — so the <li> we render outranks TreeItem's own bindings. It is
// undocumented upstream; if it ever flips, every row silently reverts to
// aria-selected="false" with no error and no type failure.
describe('VCTree as-child attribute ownership', () => {
    it('paints its own aria-selected rather than rekas', async () => {
        const wrapper = mountTree({ selection: 'sources' });
        await nextTick();

        const rows = wrapper.findAll('[role="treeitem"]');

        expect(rows[0].attributes('aria-selected')).toBe('false');
        expect(rows[1].attributes('aria-selected')).toBe('true');
    });

    it('preserves rekas own attributes it does not override', () => {
        const wrapper = mountTree();
        const row = wrapper.find('[role="treeitem"]');

        expect(row.attributes('aria-level')).toBe('1');
        expect(row.attributes('data-indent')).toBe('1');
    });

    it('switches to the checkbox pattern under cascade, suppressing aria-selected', async () => {
        const wrapper = mountTree({
            multiple: true,
            cascade: true,
            selection: ['sources'],
        });
        await nextTick();

        const rows = wrapper.findAll('[role="treeitem"]');

        expect(rows[1].attributes('aria-selected')).toBeUndefined();
        expect(rows[1].attributes('aria-checked')).toBe('true');
        expect(rows[0].attributes('aria-checked')).toBe('false');
    });
});

describe('VCTree selection', () => {
    it('emits the clicked key in single mode', async () => {
        const wrapper = mountTree();

        await wrapper.findAll('[role="treeitem"]')[1].trigger('click');

        expect(wrapper.emitted('update:selection')?.[0]).toEqual(['sources']);
    });

    it('emits an array in multiple mode', async () => {
        const wrapper = mountTree({ multiple: true, selection: [] });

        await wrapper.findAll('[role="treeitem"]')[1].trigger('click');

        expect(wrapper.emitted('update:selection')?.[0]).toEqual([['sources']]);
    });

    it('cascades to descendants of a collapsed branch', async () => {
        const wrapper = mountTree({
            multiple: true,
            cascade: true,
            selection: [],
        });

        await wrapper.findAll('[role="treeitem"]')[0].trigger('click');

        expect(wrapper.emitted('update:selection')?.[0]).toEqual([
            ['users', 'users/employees', 'users/admins'],
        ]);
    });

    it('marks a partially selected parent indeterminate', async () => {
        const wrapper = mountTree({
            multiple: true,
            cascade: true,
            selection: ['users/employees'],
            defaultExpanded: ['users'],
        });
        await nextTick();

        const parent = wrapper.findAll('[role="treeitem"]')[0];

        expect(parent.attributes('aria-checked')).toBe('mixed');
        expect(parent.attributes('data-indeterminate')).toBeDefined();
    });

    // In a cascade tree a branch's state IS its children's state. A consumer
    // seeding a non-normalised value (a restored `?path=` deep link, say)
    // must still see consistent chrome rather than a parent that renders
    // unchecked while every one of its children is checked.
    it('derives a parent from its children even when the bound value omits it', async () => {
        const wrapper = mountTree({
            multiple: true,
            cascade: true,
            selection: ['users/employees', 'users/admins'],
            defaultExpanded: ['users'],
        });
        await nextTick();

        const parent = wrapper.findAll('[role="treeitem"]')[0];

        expect(parent.attributes('aria-checked')).toBe('true');
    });

    it('does not derive parents when cascade is off', async () => {
        const wrapper = mountTree({
            multiple: true,
            selection: ['users/employees', 'users/admins'],
            defaultExpanded: ['users'],
        });
        await nextTick();

        const parent = wrapper.findAll('[role="treeitem"]')[0];

        expect(parent.attributes('aria-selected')).toBe('false');
    });

    it('does not select a disabled row', async () => {
        const wrapper = mountTree({ itemDisabled: (item: Node) => item.id === 'sources' });

        await wrapper.findAll('[role="treeitem"]')[1].trigger('click');

        expect(wrapper.emitted('update:selection')).toBeUndefined();
    });
});

// reka evaluates `passive: (props.expanded === undefined)` ONCE at setup. If a
// render path ever omits `:expanded`, reka silently switches to internal state
// and our expansion machine stops driving the flatten.
describe('VCTree expansion', () => {
    it('drives the flatten from its own state even with no v-model:expanded', async () => {
        const wrapper = mountTree();

        await wrapper.find('[data-vc-tree-trigger]').trigger('click');
        await nextTick();

        expect(rowKeys(wrapper)).toEqual(['users', 'users/employees', 'users/admins', 'sources']);
    });

    it('emits update:expanded when a branch is toggled', async () => {
        const wrapper = mountTree();

        await wrapper.find('[data-vc-tree-trigger]').trigger('click');

        expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['users']]);
    });

    it('honours a controlled expanded value', async () => {
        const expanded = ref<string[]>(['users']);
        const wrapper = mount(VCTree as never, {
            props: { items: TREE, expanded: expanded.value },
            global: { plugins: plugins as never },
        });
        await nextTick();

        expect(rowKeys(wrapper)).toHaveLength(4);
    });

    it('renders a toggle only for rows that have children', () => {
        const wrapper = mountTree();
        const rows = wrapper.findAll('[role="treeitem"]');

        expect(rows[0].find('[data-vc-tree-trigger]').exists()).toBe(true);
        expect(rows[1].find('[data-vc-tree-trigger]').exists()).toBe(false);
    });
});

describe('VCTree lazy loading', () => {
    const lazyItems: Node[] = [{ id: 'root', label: 'root' }];

    it('renders an unloaded branch as expandable', () => {
        const wrapper = mountTree({
            items: lazyItems,
            load: async () => [],
            hasChildren: () => true,
        });

        expect(wrapper.find('[data-vc-tree-trigger]').exists()).toBe(true);
    });

    it('fetches children on first expand and renders them', async () => {
        const load = vi.fn(async () => [{ id: 'root/a', label: 'a' }]);
        const wrapper = mountTree({
            items: lazyItems,
            load,
            hasChildren: () => true,
        });

        await wrapper.find('[data-vc-tree-trigger]').trigger('click');
        await nextTick();
        await nextTick();

        expect(load).toHaveBeenCalledTimes(1);
        expect(rowKeys(wrapper)).toEqual(['root', 'root/a']);
    });

    it('does not re-fetch on a second expand', async () => {
        const load = vi.fn(async () => [{ id: 'root/a', label: 'a' }]);
        const wrapper = mountTree({
            items: lazyItems,
            load,
            hasChildren: () => true,
        });

        const trigger = wrapper.find('[data-vc-tree-trigger]');
        await trigger.trigger('click');
        await nextTick();
        await trigger.trigger('click');
        await nextTick();
        await trigger.trigger('click');
        await nextTick();

        expect(load).toHaveBeenCalledTimes(1);
    });

    it('emits load-error and leaves the branch collapsed when the fetch rejects', async () => {
        const error = new Error('nope');
        const wrapper = mountTree({
            items: lazyItems,
            load: async () => { throw error; },
            hasChildren: () => true,
        });

        await wrapper.find('[data-vc-tree-trigger]').trigger('click');
        await nextTick();
        await nextTick();

        expect(wrapper.emitted('load-error')?.[0][0]).toMatchObject({ key: 'root', error });
        expect(rowKeys(wrapper)).toEqual(['root']);
    });

    it('cascades a selected parent onto children that arrive later', async () => {
        const load = vi.fn(async () => [{ id: 'root/a', label: 'a' }, { id: 'root/b', label: 'b' }]);
        const wrapper = mountTree({
            items: lazyItems,
            load,
            hasChildren: () => true,
            multiple: true,
            cascade: true,
            selection: ['root'],
        });

        await wrapper.find('[data-vc-tree-trigger]').trigger('click');
        await nextTick();
        await nextTick();

        const emitted = wrapper.emitted('update:selection');
        expect(emitted?.[emitted.length - 1]).toEqual([['root', 'root/a', 'root/b']]);
    });
});

// Two of the three shipping themes give `treeItem` a `size` variant axis, but
// the rows are rendered by the DRIVER, not by the consumer — so without an
// explicit forwarding pair there is no call site to put `:theme-variant` on and
// the axis is reachable only through app-level overrides.
describe('VCTree row theming', () => {
    const overrides = { elements: { treeItem: { variants: { size: { sm: { root: 'ROW-SM', label: 'LABEL-SM' } } } } } };

    const mountThemed = (props: Record<string, unknown>) => mount(VCTree as never, {
        props: { items: TREE, ...props },
        global: { plugins: [[vuecsTree, { overrides }]] as never },
    });

    it('forwards itemThemeVariant to every row', () => {
        const wrapper = mountThemed({ itemThemeVariant: { size: 'sm' } });

        expect(wrapper.find('[role="treeitem"]').classes()).toContain('ROW-SM');
    });

    it('forwards itemThemeClass to every row', () => {
        const wrapper = mountThemed({ itemThemeClass: { root: 'ROW-OVERRIDE' } });

        expect(wrapper.find('[role="treeitem"]').classes()).toContain('ROW-OVERRIDE');
    });

    // The driver renders the label and the trigger itself, so its own copy of
    // the row theme must resolve with the same variant — otherwise a sized row
    // would carry an unsized label.
    it('applies the row variant to the driver-rendered label too', () => {
        const wrapper = mountThemed({ itemThemeVariant: { size: 'sm' } });

        expect(wrapper.find('.LABEL-SM').exists()).toBe(true);
    });
});

describe('VCTree slots', () => {
    it('lets #item replace the row body', async () => {
        const wrapper = mount(VCTree as never, {
            props: { items: TREE },
            slots: { item: '<span class="custom">{{ params.item.label }}</span>' },
            global: { plugins: plugins as never },
        });
        await nextTick();

        expect(wrapper.findAll('.custom').map((n) => n.text())).toEqual(['users', 'sources']);
    });
});

// A branch is expanded by click AND by ArrowRight, and a held key repeats. All
// of those land on the same `toggle()` before a slow fetch settles.
describe('VCTree lazy-load concurrency', () => {
    const lazyItems = [{ id: 'root', label: 'root' }];

    const deferredLoad = () => {
        const resolvers: ((value: unknown[]) => void)[] = [];
        const load = vi.fn(() => new Promise<unknown[]>((resolve) => {
            resolvers.push(resolve as never);
        }));

        return { load, resolvers };
    };

    it('does not re-fetch a branch whose load is still in flight', async () => {
        const { load } = deferredLoad();
        const wrapper = mountTree({
            items: lazyItems,
            load,
            hasChildren: () => true,
        });

        const trigger = wrapper.find('[data-vc-tree-trigger]');
        await trigger.trigger('click');
        await trigger.trigger('click');
        await trigger.trigger('click');

        expect(load).toHaveBeenCalledTimes(1);
    });

    it('never emits a duplicate key in expanded', async () => {
        const { load, resolvers } = deferredLoad();
        const wrapper = mountTree({
            items: lazyItems,
            load,
            hasChildren: () => true,
        });

        const trigger = wrapper.find('[data-vc-tree-trigger]');
        await trigger.trigger('click');
        await trigger.trigger('click');

        for (const resolve of resolvers) {
            resolve([{ id: 'root/a', label: 'a' }]);
        }
        await nextTick();
        await nextTick();

        for (const [value] of wrapper.emitted('update:expanded') ?? []) {
            const keys = value as string[];
            expect(new Set(keys).size).toBe(keys.length);
        }
    });
});

// Two lazy branches whose fetches settle in the SAME microtask batch — an
// ordinary shape when `load` is backed by a batching dataloader, a warm cache,
// or an in-memory source. The second reconcile must not read a bound value the
// first reconcile has already superseded but the parent has not flushed yet.
describe('VCTree concurrent lazy reconcile', () => {
    const lazyRoots = [{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }];

    it('does not let a second settling branch clobber the first', async () => {
        const resolvers: ((value: unknown[]) => void)[] = [];
        const host = defineComponent({
            components: { VCTree: VCTree as never },
            setup() {
                const selection = ref<string[]>(['a', 'b']);

                return {
                    selection,
                    items: lazyRoots,
                    hasChildren: () => true,
                    load: (item: Node) => new Promise<unknown[]>((resolve) => {
                        resolvers.push(() => resolve([{ id: `${item.id}/1`, label: '1' }]));
                    }),
                };
            },
            template: `<VCTree v-model:selection="selection" multiple cascade
                :items="items" :load="load" :has-children="hasChildren" />`,
        });

        const wrapper = mount(host, { global: { plugins: plugins as never } });

        for (const trigger of wrapper.findAll('[data-vc-tree-trigger]')) {
            await trigger.trigger('click');
        }

        for (const resolve of resolvers) {
            resolve([]);
        }
        await nextTick();
        await nextTick();
        await nextTick();

        expect((wrapper.vm as unknown as { selection: string[] }).selection)
            .toEqual(['a', 'a/1', 'b', 'b/1']);
    });
});

// A leaf has no chevron, so without a spacer its label loses the trigger's
// whole footprint — more than the per-level indent gains back. Children then
// render visually LEFT of their own parent.
describe('VCTree leaf alignment', () => {
    it('reserves the trigger footprint on a row that has no trigger', async () => {
        const wrapper = mountTree({ defaultExpanded: ['users'] });
        await nextTick();

        const rows = wrapper.findAll('[role="treeitem"]');
        const branch = rows[0];
        const leaf = rows[1];

        expect(branch.find('[data-vc-tree-trigger]').exists()).toBe(true);
        expect(branch.find('[data-vc-tree-spacer]').exists()).toBe(false);

        expect(leaf.find('[data-vc-tree-trigger]').exists()).toBe(false);
        expect(leaf.find('[data-vc-tree-spacer]').exists()).toBe(true);
    });
});

describe('VCTree guide rails', () => {
    const railsOf = (row: ReturnType<typeof mountTree>['findAll'] extends never ? never : any) => row
        .findAll('[data-vc-tree-rail]')
        .map((rail: { attributes: (n: string) => string | undefined }) => ({
            continues: rail.attributes('data-continues') !== undefined,
            elbow: rail.attributes('data-elbow') !== undefined,
        }));

    // Rails must span the whole ROW. Nested inside the content span they
    // inherit the theme's vertical padding, so each one stops short of the
    // row edges and adjacent rails never meet — the line reads as a column
    // of disconnected stubs.
    it('renders rails as direct children of the row, not inside the content', async () => {
        const wrapper = mountTree({ guides: true, defaultExpanded: ['users'] });
        await nextTick();

        const row = wrapper.findAll('[role="treeitem"]')[1];
        const rail = row.find('[data-vc-tree-rail]');

        expect(rail.element.parentElement).toBe(row.element);
    });

    it('positions each rail by index so it can be absolutely placed', async () => {
        const wrapper = mountTree({ guides: true, defaultExpanded: ['users'] });
        await nextTick();

        const row = wrapper.findAll('[role="treeitem"]')[1];

        expect(row.find('[data-vc-tree-rail]').attributes('style')).toContain('--vc-tree-rail-index: 0');
    });

    it('renders no rails when guides is off', async () => {
        const wrapper = mountTree({ defaultExpanded: ['users'] });
        await nextTick();

        expect(wrapper.findAll('[data-vc-tree-rail]')).toHaveLength(0);
        expect(wrapper.find('[role="tree"]').attributes('data-guides')).toBeUndefined();
    });

    it('marks the tree so structural CSS can drop the padding indent', async () => {
        const wrapper = mountTree({ guides: true });
        await nextTick();

        expect(wrapper.find('[role="tree"]').attributes('data-guides')).toBeDefined();
    });

    it('gives a root row no gutters and a level-2 row one elbow gutter', async () => {
        const wrapper = mountTree({ guides: true, defaultExpanded: ['users'] });
        await nextTick();

        const rows = wrapper.findAll('[role="treeitem"]');

        expect(railsOf(rows[0])).toEqual([]);
        // `employees` is followed by `admins`, so its elbow continues (├).
        expect(railsOf(rows[1])).toEqual([{ continues: true, elbow: true }]);
        // `admins` is the last child, so its elbow stops (└).
        expect(railsOf(rows[2])).toEqual([{ continues: false, elbow: true }]);
    });

    it('continues an ancestor line past a nested last child', async () => {
        const nested = [
            {
                id: 'a',
                label: 'a',
                children: [
                    {
                        id: 'a/b',
                        label: 'b',
                        children: [{ id: 'a/b/c', label: 'c' }],
                    },
                    { id: 'a/d', label: 'd' },
                ],
            },
        ];
        const wrapper = mountTree({
            items: nested,
            guides: true,
            defaultExpanded: ['a', 'a/b'],
        });
        await nextTick();

        const rows = wrapper.findAll('[role="treeitem"]');
        const deepest = rows.find((row) => row.attributes('data-key') === 'a/b/c');

        // Outer gutter follows `b`, which still has `d` after it, so the line
        // must continue past `c`. `c` itself is last, so its elbow stops.
        expect(railsOf(deepest)).toEqual([
            { continues: true, elbow: false },
            { continues: false, elbow: true },
        ]);
    });
});

describe('VCTree leaf detection', () => {
    it('treats an explicitly empty children array as a leaf', () => {
        const wrapper = mountTree({
            items: [{
                id: 'a',
                label: 'a',
                children: [],
            }],
        });

        expect(wrapper.find('[data-vc-tree-trigger]').exists()).toBe(false);
        expect(wrapper.find('[role="treeitem"]').attributes('aria-expanded')).toBeUndefined();
    });

    it('collapses a lazy branch back to a leaf when it loads no children', async () => {
        const wrapper = mountTree({
            items: [{ id: 'root', label: 'root' }],
            load: async () => [],
            hasChildren: () => true,
        });

        await wrapper.find('[data-vc-tree-trigger]').trigger('click');
        await nextTick();
        await nextTick();

        const row = wrapper.find('[role="treeitem"]');
        expect(row.attributes('aria-expanded')).toBeUndefined();
        expect(wrapper.find('[data-vc-tree-trigger]').exists()).toBe(false);
    });
});

describe('VCTree disabled rows', () => {
    // `<VCTreeItem>` blocks reka's own select path, but the `#item` slot hands
    // consumers a `select()` callback that reaches the driver directly.
    it('ignores a programmatic select on a row itemDisabled marked', async () => {
        const wrapper = mount(VCTree as never, {
            props: { items: TREE, itemDisabled: (item: Node) => item.id === 'sources' },
            slots: { item: '<button class="pick" @click="params.select()">pick</button>' },
            global: { plugins: plugins as never },
        });

        await wrapper.findAll('.pick')[1].trigger('click');

        expect(wrapper.emitted('update:selection')).toBeUndefined();
    });
});

describe('VCTree selection shape coercion', () => {
    // `useSelectionMachine.setValue` already normalises cross-mode misuse on
    // the WRITE path; the read/paint path has to agree or the UI shows a
    // selection the next mutation will silently discard.
    it('paints only one row when an array is bound in single-select mode', async () => {
        const wrapper = mountTree({ selection: ['users', 'sources'] });
        await nextTick();

        const painted = wrapper.findAll('[role="treeitem"]')
            .filter((row) => row.attributes('aria-selected') === 'true');

        expect(painted).toHaveLength(1);
    });
});

describe('VCTree tree-level ARIA', () => {
    it('declares aria-multiselectable when multiple is set', () => {
        const wrapper = mountTree({ multiple: true, selection: [] });

        expect(wrapper.find('[role="tree"]').attributes('aria-multiselectable')).toBe('true');
    });

    it('omits aria-multiselectable in single-select mode', () => {
        const wrapper = mountTree();

        expect(wrapper.find('[role="tree"]').attributes('aria-multiselectable')).toBeUndefined();
    });
});
