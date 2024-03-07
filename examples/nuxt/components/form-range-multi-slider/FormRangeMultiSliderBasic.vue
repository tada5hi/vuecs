<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    defineComponent, h, reactive, ref,
} from 'vue';

export default defineComponent({
    setup() {
        const value = ref<{min: number, max: number }>(false);

        const submit = async (range: any) => {
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
    <div>
        <div class="form-group">
            <VCFormRangeMultiSlider
                :min="0"
                :max="100"
                @change="submit"
            />
        </div>
        <div class="alert alert-info">
            Current Value: {{ value }}
        </div>
    </div>
</template>
