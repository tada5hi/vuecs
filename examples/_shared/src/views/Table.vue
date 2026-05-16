<script setup lang="ts">
import { ref } from 'vue';
import {
    VCTable,
    VCTableBody,
    VCTableCell,
    VCTableEmpty,
    VCTableHeadCell,
    VCTableHeader,
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
}>(), {
    density: 'normal',
    striped: false,
    bordered: false,
    hover: true,
    rowClickable: false,
});

const sort = ref<TableSortState>(null);

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

const lastClicked = ref<User | null>(null);
function onRowClick(row: User) { lastClicked.value = row; }
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Driver shape: :columns + :data — most common form. -->
        <div>
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                driver — `:columns :data` + `v-model:sort` + row meta
            </span>
            <VCTable
                v-model:sort="sort"
                :columns="columns"
                :data="data"
                :density="density"
                :striped="striped"
                :bordered="bordered"
                :hover="hover"
                :row-clickable="rowClickable"
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
                v-if="lastClicked"
                style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--vc-color-fg-muted);"
            >
                Last clicked: <strong>{{ lastClicked.name }}</strong>
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
