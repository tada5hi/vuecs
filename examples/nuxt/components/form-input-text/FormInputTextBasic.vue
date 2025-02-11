<!--
  - Copyright (c) 2023-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { IVuelidate } from '@ilingo/vuelidate';
import { maxLength, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent, h, reactive,
} from 'vue';

export default defineComponent({
    components: {
        IVuelidate,
    },
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

        return {
            form,
            v$: $v,
        };
    },
});
</script>
<template>
    <IVuelidate :validation="v$.text">
        <template #default="props">
            <VCFormGroup
                :validation-messages="props.data"
                :validation-severity="props.severity"
            >
                <template #label>
                    Text
                </template>
                <VCFormInput
                    v-model="v$.text.$model"
                >
                    <template #groupAppend="props">
                        <span :class="props.class">
                            foo
                        </span>
                    </template>
                    <template #groupPrepend>
                        <button
                            type="button"
                            class="btn btn-xs"
                        >
                            <i class="fa fa-plus" />
                        </button>
                    </template>
                </VCFormInput>
            </VCFormGroup>
        </template>
    </IVuelidate>
</template>
