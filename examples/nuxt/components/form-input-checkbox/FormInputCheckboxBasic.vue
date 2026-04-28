<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useTranslationsForBaseValidation } from '@ilingo/vuelidate';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent,
    reactive,
    ref,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({ accepted: false, notifications: true });
        const valueMultiple = ref<number[]>([]);

        const $v = useVuelidate({ accepted: { required } }, form);
        const validationMessages = useTranslationsForBaseValidation($v.value.accepted);

        return {
            valueMultiple,
            form,
            validationMessages,
            v$: $v,
        };
    },
});
</script>
<template>
    <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
            <VCFormGroup
                :label="true"
                :label-content="'Checkbox'"
                :validation-messages="validationMessages"
            >
                <VCFormCheckbox
                    v-model="form.accepted"
                    :label="true"
                    :label-content="'I accept the terms'"
                />
            </VCFormGroup>
            <VCFormGroup
                :label="true"
                :label-content="'Switch'"
            >
                <VCFormSwitch
                    v-model="form.notifications"
                    :label="true"
                    :label-content="'Enable notifications'"
                />
            </VCFormGroup>
        </div>
        <div class="space-y-2">
            <VCFormGroup :label="true">
                <template #label>
                    <label>Pick numbers</label>
                </template>
                <VCFormCheckboxGroup v-model="valueMultiple">
                    <VCFormCheckbox
                        :value="0"
                        :label="true"
                    >
                        <template #label="{id}">
                            <label :for="id">zero</label>
                        </template>
                    </VCFormCheckbox>
                    <VCFormCheckbox
                        :value="1"
                        :label="true"
                        :label-content="'one'"
                    />
                    <VCFormCheckbox
                        :value="2"
                        :label="true"
                        :label-content="'two'"
                    />
                </VCFormCheckboxGroup>
            </VCFormGroup>
            <pre class="text-xs text-fg-muted">{{ valueMultiple }}</pre>
        </div>
    </div>
</template>
