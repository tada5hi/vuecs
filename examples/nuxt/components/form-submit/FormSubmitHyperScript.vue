<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { useTranslation } from '@ilingo/vuelidate/vue';
import {
    defineComponent,
    h,
    ref,
} from 'vue';
import { VCFormSubmit } from '@vuecs/form-controls';

export default defineComponent({
    setup() {
        const busy = ref(false);

        const translation = useTranslation({
            group: 'form',
            key: 'createText',
        });

        return () => h('div', [
            h('div', { class: 'form-group' }, [
                h(VCFormSubmit, {
                    modelValue: busy.value,
                    'onUpdate:modelValue': (val: boolean) => { busy.value = val; },
                    createText: translation.value || 'abc',
                    submit: () => new Promise<void>((resolve) => {
                        console.log('Submitted form');

                        setTimeout(() => {
                            resolve();
                        }, 5000);
                    }),
                }),
            ]),
            h('div', { class: 'alert alert-info' }, [
                'Current Value:',
                ' ',
                busy.value ? 'Busy' : 'Not busy',
            ]),
        ]);
    },
});
</script>
