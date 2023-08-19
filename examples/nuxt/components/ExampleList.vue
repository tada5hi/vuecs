<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import type { ListItemSlotProps, SlotName } from '@vue-layout/list-controls';
import { buildList } from '@vue-layout/list-controls';
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
            total,
            onCreated(item) {
                console.log(item);
            },
            onDeleted(item) {
                console.log(item);
            },
            footer: true,
        });
    },
});
</script>
