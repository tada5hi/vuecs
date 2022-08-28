<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    buildFormInput,
    buildListHeader, buildListItems, buildListNoMore, buildListPagination, buildListSearch
} from '@vue-layout/utils';
import {defineComponent, h, ref} from 'vue';

export default defineComponent({
    setup() {
        const renderHeader = () => buildListHeader();

        const searchRef = ref('');
        const items = ref([
            { name: 'ABC' },
            { name: 'DEF' }
        ])

        const renderSearch = () => h('div', [
            h('h1', 'Input'),
            buildListSearch({
                value: searchRef
            }),
            h('div', { class: 'alert alert-info mt-2' }, [
                'Current Value:',
                ' ',
                searchRef.value,
            ]),
        ]);

        const renderItems = () => buildListItems({
            items
        });

        const renderNoMore = () => buildListNoMore();

        const renderPagination = () => buildListPagination({
            meta: {
                total: items.value.length,
                limit: 1
            },
            load: (meta) => {
                console.log(meta);
            }
        })

        return () => h('div', [
            renderHeader(),
            h('hr'),
            renderSearch(),
            h('hr'),
            renderItems(),
            h('hr'),
            renderNoMore(),
            h('hr'),
            renderPagination()
        ])
    }
});
</script>
