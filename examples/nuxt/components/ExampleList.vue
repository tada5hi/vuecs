<script lang="ts">
import { VCList, useList } from '@vuecs/list';
import { defineComponent, ref } from 'vue';

type User = { id: number; name: string };

export default defineComponent({
    components: { VCList },
    setup() {
        const users = ref<User[]>([
            { id: 1, name: 'Peter' },
            { id: 2, name: 'Admin' },
        ]);

        // useList() exposes pure helpers + lets us pass arbitrary methods
        // (created/updated/deleted) through to slot props (Q3 of plan 010).
        const list = useList<User, unknown, {
            created: (u: User) => void;
            updated: (u: User) => void;
            deleted: (u: User) => void;
        }>({
            data: users,
            mergeOnUpdate: true,
            created(u) {
                users.value = list.applyCreate(users.value, u);
            },
            updated(u) {
                users.value = list.applyUpdate(users.value, u);
            },
            deleted(u) {
                users.value = list.applyDelete(users.value, u);
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
