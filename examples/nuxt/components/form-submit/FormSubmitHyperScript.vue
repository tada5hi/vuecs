<!--
  - Copyright (c) 2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { defineComponent, h, ref } from 'vue';
import { buildFormSubmit } from '@vuecs/form-controls';

export default defineComponent({
    setup() {
        const busy = ref< boolean>();

        return () => h('div', [
            h('div', { class: 'form-group' }, [
                buildFormSubmit({
                    busy,
                    submit: () => new Promise<void>((resolve, reject) => {
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
