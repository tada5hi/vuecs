<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
    VCTable,
    VCTableBody,
    VCTableCell,
    VCTableEmpty,
    VCTableHeadCell,
    VCTableHeader,
    VCTableLite,
    VCTableLoading,
    VCTableRow,
    VCTableSortIndicators,
} from '@vuecs/table';
import type { TableColumn, TableSortState, WithRowMeta } from '@vuecs/table';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
};

const props = withDefaults(defineProps<{
    density?: 'compact' | 'normal' | 'spacious';
    striped?: boolean;
    bordered?: boolean;
    hover?: boolean;
    rowClickable?: boolean;
    selectionMode?: 'single' | 'multi' | undefined;
    responsive?: boolean;
    multiSort?: boolean;
    busy?: boolean;
    placeholder?: boolean;
    expansionMode?: 'single' | 'multi';
}>(), {
    density: 'normal',
    striped: false,
    bordered: false,
    hover: true,
    rowClickable: false,
    selectionMode: undefined,
    responsive: false,
    multiSort: false,
    busy: false,
    placeholder: false,
    expansionMode: 'multi',
});

// Local mirror of the `multiSort` prop. The docs-site playground
// forwards a value via `:multi-sort="..."` (top-of-page controls);
// the bare example apps mount this view directly with no controls,
// so we expose an in-page checkbox that drives the same state. The
// watch keeps the local ref in sync when the playground toggles.
const multiSortLocal = ref(props.multiSort);
watch(() => props.multiSort, (v) => { multiSortLocal.value = v; });

const sort = ref<TableSortState>([]);
const selection = ref<number | number[] | null>(null);
// Independent sort state for the terse auto-render demo so its
// sortable headers actually reorder the second table without
// affecting the first one.
const terseSort = ref<TableSortState>([]);
// v-model for the expansion demo. Initial state shows row 2 open via
// the `_expanded` row-meta seed (see `expansionData` below), so the
// demo lands rendered as soon as the page paints — without it the
// expansion section looks visually identical to the basic driver
// table on first load.
const expanded = ref<number | number[] | null>(null);

const columns: TableColumn<User>[] = [
    {
        key: 'name',
        label: 'Name',
        sortable: true,
        isRowHeader: true,
    },
    {
        key: 'email',
        label: 'Email',
        sortable: true,
    },
    {
        key: 'role',
        label: 'Role',
        class: 'w-24',
    },
    {
        key: 'createdAt',
        label: 'Created',
        sortable: true,
        class: 'w-32',
    },
];

// Separate dataset for the expansion demo so the `_expanded: true`
// row-meta seed doesn't bleed into the basic driver table (which
// would visually shift on first paint with no explanation).
const expansionData: WithRowMeta<User & { _expanded?: boolean; bio: string }>[] = [
    {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        role: 'admin',
        createdAt: '2026-01-15',
        bio: 'Founding admin. Owns the billing pipeline + the on-call rotation.',
    },
    {
        id: 2,
        name: 'Bob',
        email: 'bob@example.com',
        role: 'editor',
        createdAt: '2026-02-03',
        bio: 'Content lead. Manages the editorial workflow and CMS templates.',
        _expanded: true,
    },
    {
        id: 3,
        name: 'Carol',
        email: 'carol@example.com',
        role: 'viewer',
        createdAt: '2026-02-19',
        bio: 'External auditor. Read-only access to the public reporting tables.',
    },
];

const data: WithRowMeta<User>[] = [
    {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        role: 'admin',
        createdAt: '2026-01-15',
    },
    {
        id: 2,
        name: 'Bob',
        email: 'bob@example.com',
        role: 'editor',
        createdAt: '2026-02-03',
        _rowVariant: 'success',
    },
    {
        id: 3,
        name: 'Carol',
        email: 'carol@example.com',
        role: 'viewer',
        createdAt: '2026-02-19',
    },
    {
        id: 4,
        name: 'Dave',
        email: 'dave@example.com',
        role: 'viewer',
        createdAt: '2026-03-08',
        _cellVariants: { role: 'warning' },
    },
    {
        id: 5,
        name: 'Eve',
        email: 'eve@example.com',
        role: 'admin',
        createdAt: '2026-04-22',
    },
];

// Both tables use `<VCTable :client-sort>` so the table reorders the
// data internally — no consumer-side sort helper needed. The
// `v-model:sort` array reflects the active sort descriptors for
// observability (the demo logs the current state below the table).

const lastClicked = ref<User | null>(null);
function onRowClick(row: User) { lastClicked.value = row; }

// Human-readable selection summary for the playground.
const selectionSummary = computed(() => {
    const v = selection.value;
    if (v === null || (Array.isArray(v) && v.length === 0)) return 'none';
    if (Array.isArray(v)) {
        const names = v.map((id) => data.find((d) => d.id === id)?.name ?? id);
        return `${v.length} row(s): ${names.join(', ')}`;
    }
    const found = data.find((d) => d.id === v);
    return found?.name ?? String(v);
});

// Human-readable summary of the multi-sort descriptor array.
const sortSummary = computed(() => sort.value
    .map((s) => `${s.key} ${s.direction}`)
    .join(' → ') || 'none');

</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- In-page demo controls so the example apps (Tailwind / BS /
             Bulma / Nuxt) expose toggles that aren't in the docs-site
             playground. The docs playground forwards `multi-sort` as a
             prop too — both wires drive the same local state. -->
        <label style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.75rem;">
            <input
                v-model="multiSortLocal"
                type="checkbox"
            >
            <span>Enable multi-sort (Shift-click headers <em>or</em> use the chip row below to manage keys)</span>
        </label>

        <!-- Sort-indicators chip row — discoverable no-modifier
             alternative to Shift-click. Shipped @vuecs/table component,
             v-model bound to the same sort ref the table reads. -->
        <VCTableSortIndicators
            v-if="multiSortLocal"
            v-model:sort="sort"
            :columns="columns"
        />

        <!-- Driver shape: :columns + :data — most common form. -->
        <div>
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                driver — `:columns :data` + `v-model:sort` + `v-model:selection` + row meta
            </span>
            <VCTable
                v-model:sort="sort"
                v-model:selection="selection"
                :columns="columns"
                :data="data"
                :density="density"
                :striped="striped"
                :bordered="bordered"
                :hover="hover"
                :row-clickable="rowClickable"
                :selection-mode="selectionMode"
                :responsive="responsive"
                :multi-sort="multiSortLocal"
                :busy="busy"
                :placeholder="placeholder"
                client-sort
                @row-click="onRowClick"
            >
                <VCTableHeader>
                    <VCTableRow>
                        <!-- Selection column — only when selection is on.
                             Renders the select-all checkbox (multi mode)
                             or an empty cell (single mode). -->
                        <VCTableHeadCell
                            v-if="selectionMode"
                            is-selector
                        />
                        <VCTableHeadCell
                            v-for="col in columns"
                            :key="col.key"
                            :column-key="col.key"
                            :sortable="col.sortable"
                        >
                            {{ col.label }}
                        </VCTableHeadCell>
                    </VCTableRow>
                </VCTableHeader>
                <VCTableBody>
                    <template #row="{ row, index }">
                        <VCTableRow
                            :row="row"
                            :index="index"
                        >
                            <VCTableCell
                                v-if="selectionMode"
                                is-selector
                            />
                            <VCTableCell
                                v-for="col in columns"
                                :key="col.key"
                                :column-key="col.key"
                                :is-row-header="col.isRowHeader"
                                :data-label="col.label"
                            >
                                {{ (row as User)[col.key as keyof User] }}
                            </VCTableCell>
                        </VCTableRow>
                    </template>
                </VCTableBody>
                <VCTableEmpty>No users yet.</VCTableEmpty>
            </VCTable>
            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                Sort{{ multiSortLocal ? ' (multi — Shift-click to add)' : '' }}: <strong>{{ sortSummary }}</strong>
            </div>
            <div
                v-if="selectionMode"
                style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--vc-color-fg-muted);"
            >
                Selection ({{ selectionMode }}): <strong>{{ selectionSummary }}</strong>
            </div>
            <div
                v-if="lastClicked"
                style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--vc-color-fg-muted);"
            >
                Last clicked: <strong>{{ lastClicked.name }}</strong>
            </div>
        </div>

        <!--
            Terse form — driver auto-render (v0.2-B). No `<VCTableHeader>` /
            `<VCTableBody>` markup; the table walks the slot vnodes and
            renders the missing bands itself. `<VCTableCell>` cells use
            the default cell renderer (v0.2-A) via `accessor` / `formatter`.
        -->
        <div style="padding-top: 0.5rem; border-top: 1px dashed var(--vc-color-border);">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                terse form — `&lt;VCTable :columns :data v-model:sort /&gt;` with auto-rendered header + body
            </span>
            <VCTable
                v-model:sort="terseSort"
                :columns="columns"
                :data="data"
                :density="density"
                :striped="striped"
                :bordered="bordered"
                :hover="hover"
                :responsive="responsive"
                :multi-sort="multiSortLocal"
                client-sort
            />
        </div>

        <!--
            VCTableLite (v0.2-C) — slim sibling without sort / row-click
            machinery. For consumers who want the columns driver + theme
            system + auto-render but bring their own state plumbing.
        -->
        <div style="padding-top: 0.5rem; border-top: 1px dashed var(--vc-color-border);">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                `&lt;VCTableLite&gt;` — slim escape hatch (no sort / no row-click)
            </span>
            <VCTableLite
                :columns="columns"
                :data="data"
                :density="density"
                :striped="striped"
                :bordered="bordered"
                :hover="hover"
                :responsive="responsive"
            />
        </div>

        <!--
            Expandable rows (plan 038). Driver-mode `:expandable` adds
            a leading chevron trigger column; the `#expansion` slot
            renders the per-row panel. v-model:expanded carries the
            open-key set (multi mode) or bare key (single mode). The
            `_expanded: true` flag on Bob's row seeds the demo open on
            first paint so the panel is visible without interaction.
        -->
        <div style="padding-top: 0.5rem; border-top: 1px dashed var(--vc-color-border);">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                expandable rows — `:expandable` + `#expansion` slot ({{ expansionMode }} mode)
            </span>
            <VCTable
                v-model:expanded="expanded"
                :columns="[{ key: 'name', isRowHeader: true }, { key: 'email' }, { key: 'role' }]"
                :data="expansionData"
                :density="density"
                :striped="striped"
                :bordered="bordered"
                :hover="hover"
                :responsive="responsive"
                :expansion-mode="expansionMode"
                expandable
            >
                <template #expansion="{ row }">
                    <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                        <strong>{{ (row as { name: string }).name }}</strong>
                        <span style="font-size: 0.875rem;">
                            {{ (row as { bio: string }).bio }}
                        </span>
                        <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                            Joined {{ (row as { createdAt: string }).createdAt }}
                        </span>
                    </div>
                </template>
            </VCTable>
            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                Expanded keys: <strong>{{ JSON.stringify(expanded) }}</strong>
            </div>
        </div>

        <!-- Empty / loading states -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-top: 0.5rem; border-top: 1px dashed var(--vc-color-border);">
            <div>
                <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                    empty state
                </span>
                <VCTable
                    :columns="columns"
                    :data="[]"
                >
                    <VCTableHeader>
                        <VCTableRow>
                            <VCTableHeadCell
                                v-for="col in columns"
                                :key="col.key"
                            >
                                {{ col.label }}
                            </VCTableHeadCell>
                        </VCTableRow>
                    </VCTableHeader>
                    <VCTableEmpty>No users to display.</VCTableEmpty>
                </VCTable>
            </div>
            <div>
                <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                    loading state (first load)
                </span>
                <VCTable
                    :columns="columns"
                    :data="[]"
                    busy
                >
                    <VCTableHeader>
                        <VCTableRow>
                            <VCTableHeadCell
                                v-for="col in columns"
                                :key="col.key"
                            >
                                {{ col.label }}
                            </VCTableHeadCell>
                        </VCTableRow>
                    </VCTableHeader>
                    <VCTableLoading>Loading…</VCTableLoading>
                </VCTable>
            </div>
        </div>
    </div>
</template>

