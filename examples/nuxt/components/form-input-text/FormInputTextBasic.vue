<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { maxLength, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent, h, reactive, ref,
} from 'vue';

export default defineComponent({
    setup() {
        const form = reactive({
            text: 'foo',
        });

        const $v = useVuelidate({
            text: {
                minLength: minLength(5),
                maxLength: maxLength(10),
            },
        }, form);

        const validationMessages = {
            maxLength: 'The length of the input must be less than {{max}}.',
            minLength: 'The length of the input must be greater than {{min}}.',
        };

        return {
            form,
            validationMessages,
            v$: $v,
        };
    },
});
</script>
<template>
    <VCFormGroup
        :validation-messages="validationMessages"
        :validation-result="v$.text"
    >
        <template #label>
            Text
        </template>
        <VCFormInput
            v-model="form.text"
        />
    </VCFormGroup>
</template>
