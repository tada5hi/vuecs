<!--
  - Copyright (c) 2022-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    buildList,
} from '@vuecs/list-controls';
import { defineComponent, h, ref } from 'vue';

export default defineComponent({
    setup() {
        const items = ref([
            { name: 'ABC' },
            { name: 'DEF' },
        ]);

        return () => buildList({
            data: items.value,
            total: items.value.length,
        });
    },
});
</script>
