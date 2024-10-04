<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { ListItemSlotProps, SlotName } from '@vuecs/list-controls';
import { buildList } from '@vuecs/list-controls';
import type { SlotsType } from 'vue';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
    slots: Object as SlotsType<{
        [SlotName.ITEM_ACTIONS]: ListItemSlotProps<any>
    }>,
    setup(props, ctx) {
        const data = ref([
            { id: 1, name: 'Peter' },
            { id: 2, name: 'Admin' },
        ]);
        const total = ref(2);

        watch(total, () => {
            console.log(total.value);
        });

        return () => buildList({
            slotItems: ctx.slots,
            data: data.value,
            total: total.value,
            onCreated(item) {
                total.value++;
                data.value.push(item);
            },
            onUpdated: (item) => {
                const index = data.value.findIndex((el) => el.id === item.id);
                if (index !== -1) {
                    data.value[index] = item;
                }
            },
            onDeleted(item) {
                const index = data.value.findIndex((el) => el.id === item.id);
                if (index !== -1) {
                    data.value.splice(index, 1);
                    total.value--;
                }
            },
            footer: true,
        });
    },
});
</script>
