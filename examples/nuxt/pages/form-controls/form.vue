<!--
  - Copyright (c) 2022-2023.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import {
    buildFormInputCheckbox,
    buildFormInputText,
    buildFormSelect,
    buildFormSubmit,
    buildFormTextarea,
} from '@vue-layout/form-controls';
import { maxLength, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import {
    defineComponent, h, reactive, ref,
} from 'vue';

export default defineComponent({
    setup() {
        const selectRef = ref('');
        const textareaRef = ref('Initial textarea text');

        const busy = ref(false);

        const form = reactive({
            text: '',
            checkbox: true,
        });

        const $v = useVuelidate({
            text: {
                minLength: minLength(3),
                maxLength: maxLength(5),
            },
        }, form);

        const renderInputText = () => h('div', [
            h('h1', 'Input'),
            buildFormInputText({
                validationResult: $v.value.text,
                labelContent: 'My input label',

                value: form.text,
                onChange: (value) => {
                    console.log('Value of input text changed', value);
                    form.text = value;
                },
            }),
            h('div', { class: 'alert alert-info' }, [
                'Current Value:',
                ' ',
                form.text,
            ]),
        ]);

        const renderInputCheckbox = () => h('div', [
            h('h1', 'Checkbox'),
            buildFormInputCheckbox({
                labelContent: 'My input label',

                value: form.checkbox,
                onChange: (value) => {
                    console.log('Value of input checkbox changed', value);
                    form.checkbox = value;
                },
            }),
            h('div', { class: 'alert alert-info' }, [
                'Current Value:',
                ' ',
                form.checkbox ? 'true' : 'false',
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
                onChange: (value) => {
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
                onChange: (value) => {
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
            renderInputText(),
            h('hr'),
            renderInputCheckbox(),
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
