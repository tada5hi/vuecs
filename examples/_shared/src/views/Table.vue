<script setup lang="ts">
import { computed, ref } from 'vue';
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
} from '@vuecs/table';
import type { TableColumn, TableSortState, WithRowMeta } from '@vuecs/table';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
};

withDefaults(defineProps<{
    density?: 'compact' | 'normal' | 'spacious';
    striped?: boolean;
    bordered?: boolean;
    hover?: boolean;
    rowClickable?: boolean;
    selectionMode?: 'single' | 'multi' | undefined;
    responsive?: boolean;
}>(), {
    density: 'normal',
    striped: false,
    bordered: false,
    hover: true,
    rowClickable: false,
    selectionMode: undefined,
    responsive: false,
});

const sort = ref<TableSortState>(null);
const selection = ref<number | number[] | null>(null);
// Independent sort state for the terse auto-render demo so its
// sortable headers actually reorder the second table without
// affecting the first one.
const terseSort = ref<TableSortState>(null);

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

// Controlled sort: VCTable emits sort intent via `v-model:sort` but
// never reorders data itself. The demo applies the sort client-side
// so the user sees real reordering across every sortable column.
function applySort(rows: WithRowMeta<User>[], state: TableSortState) {
    if (!state) return rows;
    const key = state.key as keyof User;
    const dir = state.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
    });
}
const sortedData = computed(() => applySort(data, sort.value));
const terseSortedData = computed(() => applySort(data, terseSort.value));

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
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Driver shape: :columns + :data — most common form. -->
        <div>
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                driver — `:columns :data` + `v-model:sort` + `v-model:selection` + row meta
            </span>
            <VCTable
                v-model:sort="sort"
                v-model:selection="selection"
                :columns="columns"
                :data="sortedData"
                :density="density"
                :striped="striped"
                :bordered="bordered"
                :hover="hover"
                :row-clickable="rowClickable"
                :selection-mode="selectionMode"
                :responsive="responsive"
                @row-click="onRowClick"
            >
                <VCTableHeader>
                    <VCTableRow>
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
                :data="terseSortedData"
                :density="density"
                :striped="striped"
                :bordered="bordered"
                :hover="hover"
                :responsive="responsive"
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
