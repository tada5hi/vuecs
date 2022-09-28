<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    buildListHeader,
    buildListItems,
    buildListNoMore,
    buildListPagination,
    buildListSearch,
} from '@vue-layout/hyperscript';
import { defineComponent, h, ref } from 'vue';

export default defineComponent({
    setup() {
        const busy = ref(false);

        const renderHeader = () => buildListHeader({
            busy,
            load: () => new Promise<void>((resolve, reject) => {
                console.log('Loaded data');

                setTimeout(() => {
                    resolve();
                }, 5000);
            }),
        });

        const searchRef = ref('');
        const items = ref([
            { name: 'ABC' },
            { name: 'DEF' },
        ]);

        const renderSearch = () => h('div', [
            buildListSearch({
                value: searchRef,
            }),
            h('div', { class: 'alert alert-info mt-2' }, [
                'Current Value:',
                ' ',
                searchRef.value,
            ]),
        ]);

        const renderItems = () => buildListItems({
            data: items,
        });

        const renderNoMore = () => buildListNoMore();

        const renderPagination = () => buildListPagination({
            meta: {
                total: items.value.length,
                limit: 1,
            },
            load: (meta) => {
                console.log(meta);
            },
        });

        return () => h('div', [
            renderHeader(),
            h('hr'),
            renderSearch(),
            h('hr'),
            renderItems(),
            h('hr'),
            renderNoMore(),
            h('hr'),
            renderPagination(),
        ]);
    },
});
</script>
