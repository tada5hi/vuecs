<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    buildFormInput,
    buildFormSelect,
    buildFormSubmit,
    buildFormTextarea,
} from '@vue-layout/utils';
import { defineComponent, h, ref } from 'vue';

export default defineComponent({
    setup() {
        const inputRef = ref('Initial input text');
        const selectRef = ref('');
        const textareaRef = ref('Initial textarea text');

        const busy = ref(false);

        const renderInput = () => h('div', [
            h('h1', 'Input'),
            buildFormInput({
                labelContent: 'My input label',

                value: inputRef,
                change: (value) => {
                    console.log('Value of input changed', value);
                },
            }),
            h('div', { class: 'alert alert-info' }, [
                'Current Value:',
                ' ',
                inputRef.value,
            ]),
        ]);

        const renderSelect = () => h('div', [
            h('h1', 'Select'),
            buildFormSelect({
                labelContent: 'My select label',
                optionDefaultText: 'Select :O',
                options: [
                    { id: 1, value: 'Option 1' },
                    { id: 2, value: 'Option 2' },
                ],
                value: selectRef,
                change: (value) => {
                    console.log('Value of select changed', value);
                },
            }),
            h('div', { class: 'alert alert-info' }, [
                'Current Value:',
                ' ',
                selectRef.value,
            ]),
        ]);

        const renderTextarea = () => h('div', [
            h('h1', 'Textarea'),
            buildFormTextarea({
                labelContent: 'My textarea label',
                value: textareaRef,
                change: (value) => {
                    console.log('Value of textarea changed', value);
                },
            }),
            h('div', { class: 'alert alert-info' }, [
                'Current Value:',
                ' ',
                textareaRef.value,
            ]),
        ]);

        const renderSubmit = () => h('div', [
            h('h1', 'Submit'),
            buildFormSubmit({
                busy,
                submit: () => new Promise<void>((resolve, reject) => {
                    console.log('Submitted form');

                    setTimeout(() => {
                        resolve();
                    }, 5000);
                }),
            }),
            h('div', { class: 'alert alert-info' }, [
                'Current Value:',
                ' ',
                busy.value ? 'Busy' : 'Not busy',
            ]),
        ]);

        return () => h('div', { class: 'container' }, [
            renderInput(),
            h('hr'),
            renderSelect(),
            h('hr'),
            renderTextarea(),
            h('hr'),
            renderSubmit(),
        ]);
    },
});
</script>
