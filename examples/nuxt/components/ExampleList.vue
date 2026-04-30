<script lang="ts">
import { VCList, defineList } from '@vuecs/list';
import { defineComponent, ref } from 'vue';

type User = { id: number; name: string };

export default defineComponent({
    components: { VCList },
    setup() {
        const users = ref<User[]>([
            { id: 1, name: 'Peter' },
            { id: 2, name: 'Admin' },
        ]);

        // Per-op handlers — each chooses how to apply the operation.
        // Demonstrates direct mutation (push/splice) instead of array
        // replacement; equally compatible with store actions or REST calls.
        const list = defineList<User>({
            data: users,
            onCreated: (item) => { users.value.push(item); },
            onUpdated: (item) => {
                const idx = list.findIndex(item);
                if (idx >= 0) {
                    users.value[idx] = { ...users.value[idx], ...item };
                }
            },
            onDeleted: (item) => {
                const idx = list.findIndex(item);
                if (idx >= 0) users.value.splice(idx, 1);
            },
        });

        return { list };
    },
});
</script>

<template>
    <VCList :state="list">
        <slot
            name="default"
            v-bind="list"
        />
        <template #item="bind">
            <slot
                name="item"
                v-bind="{ ...list, ...bind }"
            />
        </template>
        <template #footer="bind">
            <slot
                name="footer"
                v-bind="{ ...list, ...bind }"
            />
        </template>
    </VCList>
</template>
