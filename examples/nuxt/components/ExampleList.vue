<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { VCList } from '@vuecs/list-controls';
import { defineComponent, h, ref } from 'vue';

export default defineComponent({
    setup(props, ctx) {
        const data = ref([
            { id: 1, name: 'Peter' },
            { id: 2, name: 'Admin' },
        ]);
        const total = ref(2);

        return () => h(VCList, {
            data: data.value,
            total: total.value,
            footer: true,
            onCreated(item: { id: number; name: string }) {
                total.value++;
                data.value.push(item);
            },
            onUpdated(item: { id: number; name: string }) {
                const index = data.value.findIndex((el) => el.id === item.id);
                if (index !== -1) {
                    data.value[index] = item;
                }
            },
            onDeleted(item: { id: number; name: string }) {
                const index = data.value.findIndex((el) => el.id === item.id);
                if (index !== -1) {
                    data.value.splice(index, 1);
                    total.value--;
                }
            },
        }, ctx.slots);
    },
});
</script>
