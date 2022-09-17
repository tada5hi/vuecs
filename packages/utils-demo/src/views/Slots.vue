<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script>
import { defineComponent } from 'vue';
import ExampleList from '../components/ExampleList.vue';

export default defineComponent({
    components: { ExampleList },
});
</script>
<template>
    <example-list>
        <template #item-actions>
            <button class="btn btn-xs btn-dark">
                <i class="fa fa-play" />
            </button>
        </template>
    </example-list>
</template>
