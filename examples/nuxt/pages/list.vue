<!--
  - Copyright (c) 2022-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    buildListItems,
    buildListNoMore,
} from '@vue-layout/list-controls';
import { defineComponent, h, ref } from 'vue';

export default defineComponent({
    setup() {
        const busy = ref(false);

        const searchRef = ref('');
        const items = ref([
            { name: 'ABC' },
            { name: 'DEF' },
        ]);

        const renderItems = () => buildListItems({
            data: items,
        });

        const renderNoMore = () => buildListNoMore();

        return () => h('div', [
            renderItems(),
            h('hr'),
            renderNoMore(),
        ]);
    },
});
</script>
