<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { buildList } from '@vue-layout/list-controls';
import { defineComponent } from 'vue';

export default defineComponent({
    setup(props, ctx) {
        return () => buildList({
            slotItems: ctx.slots,
            data: [
                { id: 1, name: 'Peter' },
                { id: 1, name: 'Admin' },
            ],
        });
    },
});
</script>
