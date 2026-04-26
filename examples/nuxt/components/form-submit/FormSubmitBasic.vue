<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useSubmitButton } from '@vuecs/form-controls';
import {
    defineComponent,
    ref,
} from 'vue';

export default defineComponent({
    setup() {
        const busy = ref<boolean>(false);
        const isEditing = ref<boolean>(false);

        // Reactive bind-object — label / icon / color all come from the
        // `submitButton` defaults registered in @vuecs/core install. The
        // composable is marked @experimental in @vuecs/form-controls.
        const submit = useSubmitButton({
            isEditing: () => isEditing.value,
            loading: () => busy.value,
        });

        const onClick = async () => {
            busy.value = true;
            console.log('Submitted form');
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    console.log('Resolved');
                    resolve();
                }, 5000);
            });
            busy.value = false;
        };

        return {
            busy,
            isEditing,
            submit,
            onClick,
        };
    },
});
</script>
<template>
    <div class="space-y-3">
        <VCButton
            v-bind="submit"
            @click="onClick"
        />
        <button
            type="button"
            class="rounded border px-2 py-1 text-xs"
            @click="isEditing = !isEditing"
        >
            Toggle isEditing ({{ isEditing ? 'on' : 'off' }})
        </button>
        <div class="rounded-md border border-blue-200 bg-blue-50 p-2 text-sm text-blue-800">
            Current Value: {{ busy ? 'Busy' : 'Not Busy' }}
        </div>
    </div>
</template>
