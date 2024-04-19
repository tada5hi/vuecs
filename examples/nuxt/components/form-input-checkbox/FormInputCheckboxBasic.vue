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
    defineComponent, reactive, ref,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({
            text: null,
        });

        const valueMultiple = ref([]);

        const $v = useVuelidate({
            text: {
                required,
            },
        }, form);

        const validationMessages = useTranslationsForBaseValidation($v.value.text);

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
    <div class="row">
        <div class="col">
            <VCFormGroup
                :label="true"
                :label-content="'Label'"
                :validation-messages="validationMessages"
            >
                <VCFormInputCheckbox
                    v-model="form.text"
                    :label="true"
                    :label-content="'switch'"
                    :group="true"
                    :group-class="'form-switch'"
                />
            </VCFormGroup>
        </div>
        <div class="col">
            <VCFormGroup
                :label="true"
            >
                <template #label>
                    <label>Label</label>
                </template>
                <VCFormInputCheckbox
                    v-model="valueMultiple"
                    :value="0"
                    :label="true"
                    :group="true"
                    :group-class="'form-switch'"
                >
                    <template #label="{id}">
                        <label :for="id">zero</label>
                    </template>
                </VCFormInputCheckbox>
            </VCFormGroup>
            <VCFormGroup
                :label="true"
                :label-content="'Label'"
            >
                <VCFormInputCheckbox
                    v-model="valueMultiple"
                    :value="1"
                    :label="true"
                    :label-content="'one'"
                    :group="true"
                    :group-class="'form-switch'"
                />
            </VCFormGroup>
            {{ valueMultiple }}
        </div>
    </div>
</template>
