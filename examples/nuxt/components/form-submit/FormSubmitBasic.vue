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
        const busy = ref<boolean>(false);

        const submit = async () => {
            console.log('Submitted form');

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    console.log('Resolved');
                    resolve();
                }, 5000);
            });
        };

        return {
            busy,
            submit,
        };
    },
});
</script>
<template>
    <div class="space-y-3">
        <VCFormSubmit
            v-model="busy"
            :submit="submit"
            :icon="true"
        />
        <div class="rounded-md border border-blue-200 bg-blue-50 p-2 text-sm text-blue-800">
            Current Value: {{ busy ? 'Busy' : 'Not Busy' }}
        </div>
    </div>
</template>
