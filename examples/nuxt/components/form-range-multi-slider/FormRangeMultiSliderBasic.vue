<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    defineComponent,
    ref,
} from 'vue';

export default defineComponent({
    setup() {
        // Range mode: array v-model. Same VCFormSlider component, the array
        // shape determines thumb count.
        const value = ref<number[]>([20, 80]);

        return { value };
    },
});
</script>
<template>
    <div class="space-y-3">
        <VCFormSlider
            v-model="value"
            :min="0"
            :max="100"
        />
        <div class="rounded-md border border-blue-200 bg-blue-50 p-2 text-sm text-blue-800">
            Current Value: {{ value }}
        </div>
    </div>
</template>
