<script setup lang="ts">
import { VCButton } from '@vuecs/button';
import { VCEmptyState } from '@vuecs/elements';
import type { PaginationMeta } from '@vuecs/pagination';
import type { TableColumn, TableSortState } from '@vuecs/table';
import { VCTableCard } from '@vuecs/table-card';
import { computed, ref, watch } from 'vue';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const props = withDefaults(defineProps<{
    busy?: boolean;
    empty?: boolean;
    searchable?: boolean;
    aside?: boolean;
}>(), {
    busy: false,
    empty: false,
    searchable: true,
    aside: true,
});

const NAMES = [
    'Alice Johnson', 
    'Bob Smith', 
    'Carol White', 
    'Dan Brown', 
    'Eve Davis',
    'Frank Miller', 
    'Grace Wilson', 
    'Heidi Moore', 
    'Ivan Taylor', 
    'Judy Anderson',
    'Mallory Thomas', 
    'Niaj Jackson', 
    'Olivia Harris', 
    'Peggy Martin', 
    'Rupert Lee',
    'Sybil Clark', 
    'Trent Lewis', 
    'Victor Walker', 
    'Walter Hall', 
    'Yolanda Young',
];
const ROLES = ['admin', 'editor', 'viewer'];

const users: User[] = NAMES.map((name, index) => ({
    id: index + 1,
    name,
    email: `${name.split(' ')[0]!.toLowerCase()}@example.com`,
    role: ROLES[index % ROLES.length]!,
}));

const columns: TableColumn<User>[] = [
    {
        key: 'name', 
        label: 'Name', 
        sortable: true, 
    },
    { key: 'email', label: 'Email' },
    {
        key: 'role', 
        label: 'Role', 
        sortable: true, 
    },
];

const search = ref('');
const role = ref('');
const sort = ref<TableSortState>([]);
const limit = 5;
const offset = ref(0);
const loading = ref(false);

const filtered = computed(() => search.value !== '' || role.value !== '');

// Stand-in for a server: filter, sort, count, then slice one page.
const matches = computed(() => {
    if (props.empty) {
        return [];
    }

    const needle = search.value.toLowerCase();
    const rows = users.filter((user) => (needle === '' || user.name.toLowerCase().includes(needle)) &&
        (role.value === '' || user.role === role.value));

    const [descriptor] = sort.value;

    if (descriptor) {
        const key = descriptor.key as keyof User;
        const factor = descriptor.direction === 'asc' ? 1 : -1;

        rows.sort((a, b) => String(a[key]).localeCompare(String(b[key])) * factor);
    }

    return rows;
});
const page = computed(() => matches.value.slice(offset.value, offset.value + limit));

// A new query starts on the first page.
watch([search, role, sort], () => {
    offset.value = 0;
});

const reload = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 1200);
};

const onPage = (meta: PaginationMeta) => {
    offset.value = meta.offset;
};

const reset = () => {
    search.value = '';
    role.value = '';
};
</script>

<template>
    <div class="vc-demo-stack">
        <VCTableCard
            v-model:search="search"
            v-model:sort="sort"
            title="Users"
            description="Everyone with access to this workspace."
            :data="page"
            :columns="columns"
            :searchable="props.searchable"
            :busy="props.busy || loading"
            :filtered="filtered"
            :total="matches.length"
            :limit="limit"
            :offset="offset"
            @page="onPage"
            @reset="reset"
        >
            <template #actions>
                <VCButton
                    variant="outline"
                    @click="reload"
                >
                    Reload
                </VCButton>
                <VCButton>Add user</VCButton>
            </template>

            <template #cell-role="{ row }">
                <code>{{ row.role }}</code>
            </template>

            <template #empty>
                <VCEmptyState
                    title="No users yet"
                    description="Users you invite will show up here."
                    action-label="Invite user"
                />
            </template>

            <template
                v-if="props.aside"
                #aside
            >
                <div class="vc-demo-aside">
                    <p class="vc-demo-h">
                        Role
                    </p>
                    <label
                        v-for="option in ['', ...ROLES]"
                        :key="option"
                        class="vc-demo-option"
                    >
                        <input
                            v-model="role"
                            type="radio"
                            name="table-card-role"
                            :value="option"
                        >
                        {{ option || 'any' }}
                    </label>
                </div>
            </template>
        </VCTableCard>
        <p class="vc-demo-note">
            search: "{{ search }}" · sort: {{ sort.map((s) => `${s.key} ${s.direction}`).join(', ') || 'none' }} · offset: {{ offset }}
        </p>
    </div>
</template>

<style scoped>
.vc-demo-stack {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.vc-demo-h {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: var(--vc-color-fg-muted);
}
.vc-demo-aside {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.875rem;
}
.vc-demo-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.vc-demo-note {
    margin: 0;
    font-size: 0.75rem;
    color: var(--vc-color-fg-muted);
}
</style>
