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
        const value = ref<{ min: number, max: number }>(false);

        const submit = async (range: { min: number, max: number }) => {
            value.value = range;
        };

        return {
            value,
            submit,
        };
    },
});
</script>
<template>
    <div class="space-y-3">
        <VCFormRangeMultiSlider
            :min="0"
            :max="100"
            @change="submit"
        />
        <div class="rounded-md border border-blue-200 bg-blue-50 p-2 text-sm text-blue-800">
            Current Value: {{ value }}
        </div>
    </div>
</template>
