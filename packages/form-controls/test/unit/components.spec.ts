// @vitest-environment jsdom
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import { VCFormGroup } from '../../src/components/form-group/component';
import { VCFormInput } from '../../src/components/form-input/component';
import { VCFormInputCheckbox } from '../../src/components/form-input-checkbox/component';
import { VCFormSelect } from '../../src/components/form-select/component';
import { VCFormTextarea } from '../../src/components/form-textarea/component';
import { VCValidationGroup } from '../../src/components/validation-group/module';

const themePlugin = {
    install: (app: any) => {
        installThemeManager(app);
        installDefaultsManager(app);
    },
};

describe('VCFormGroup', () => {
    it('should render a div wrapper', () => {
        const wrapper = mount(VCFormGroup, { global: { plugins: [themePlugin] } });
        expect(wrapper.element.tagName).toBe('DIV');
    });

    it('should render label when labelContent is provided', () => {
        const wrapper = mount(VCFormGroup, {
            props: { labelContent: 'My Label' },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('label').exists()).toBe(true);
        expect(wrapper.find('label').text()).toBe('My Label');
    });

    it('should not render label when label is explicitly false', () => {
        const wrapper = mount(VCFormGroup, {
            props: { label: false, labelContent: 'Hidden' },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('label').exists()).toBe(false);
    });

    it('should render label slot', () => {
        const wrapper = mount(VCFormGroup, {
            global: { plugins: [themePlugin] },
            slots: { label: 'Slot Label' },
        });
        expect(wrapper.text()).toContain('Slot Label');
    });

    it('should render hint when hintContent is provided', () => {
        const wrapper = mount(VCFormGroup, {
            props: { hintContent: 'Help text' },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toContain('Help text');
    });

    it('should render default slot content', () => {
        const wrapper = mount(VCFormGroup, {
            global: { plugins: [themePlugin] },
            slots: { default: () => h('input', { type: 'text' }) },
        });
        expect(wrapper.find('input').exists()).toBe(true);
    });

    it('should render validation messages', () => {
        const wrapper = mount(VCFormGroup, {
            props: {
                validation: true,
                validationMessages: { required: 'Field is required' },
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toContain('Field is required');
    });

    it('should apply validation error class on root when messages present', () => {
        const preset = {
            elements: {
                formGroup: {
                    classes: {
                        root: 'form-group',
                        validationError: 'has-error',
                    },
                },
            },
        };
        const wrapper = mount(VCFormGroup, {
            props: {
                validation: true,
                validationMessages: { required: 'Required' },
            },
            global: {
                plugins: [{
                    install: (app: any) => {
                        installThemeManager(app, { themes: [preset] });
                        installDefaultsManager(app);
                    },
                }],
            },
        });
        expect(wrapper.classes()).toContain('has-error');
    });

    it('should apply validation warning class when severity is warning', () => {
        const preset = {
            elements: {
                formGroup: {
                    classes: {
                        root: 'form-group',
                        validationWarning: 'has-warning',
                        validationError: 'has-error',
                    },
                },
            },
        };
        const wrapper = mount(VCFormGroup, {
            props: {
                validation: true,
                validationMessages: { hint: 'Check this' },
                validationSeverity: 'warning',
            },
            global: {
                plugins: [{
                    install: (app: any) => {
                        installThemeManager(app, { themes: [preset] });
                        installDefaultsManager(app);
                    },
                }],
            },
        });
        expect(wrapper.classes()).toContain('has-warning');
        expect(wrapper.classes()).not.toContain('has-error');
    });

    it('should not show validation when validation prop is false', () => {
        const wrapper = mount(VCFormGroup, {
            props: {
                validation: false,
                validationMessages: { required: 'Required' },
            },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).not.toContain('Required');
    });

    it('should default validation to true when prop is omitted (3-layer fallthrough)', () => {
        const wrapper = mount(VCFormGroup, {
            props: { validationMessages: { required: 'Required' } },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toContain('Required');
    });

    it('should render in order: label, content, validation, hint', () => {
        const wrapper = mount(VCFormGroup, {
            props: {
                labelContent: 'Label',
                hintContent: 'Hint',
                validation: true,
                validationMessages: { req: 'Error' },
            },
            global: { plugins: [themePlugin] },
            slots: { default: () => h('input') },
        });
        const text = wrapper.text();
        const labelPos = text.indexOf('Label');
        const errorPos = text.indexOf('Error');
        const hintPos = text.indexOf('Hint');
        expect(labelPos).toBeLessThan(errorPos);
        expect(errorPos).toBeLessThan(hintPos);
    });
});

describe('VCFormInput', () => {
    it('should render an input element', () => {
        const wrapper = mount(VCFormInput, { global: { plugins: [themePlugin] } });
        expect(wrapper.find('input').exists()).toBe(true);
    });

    it('should set input type', () => {
        const wrapper = mount(VCFormInput, {
            props: { type: 'email' },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('input').attributes('type')).toBe('email');
    });

    it('should emit update:modelValue on input', async () => {
        const wrapper = mount(VCFormInput, {
            props: { modelValue: '' },
            global: { plugins: [themePlugin] },
        });

        await wrapper.find('input').setValue('hello');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')![0]).toEqual(['hello']);
    });

    it('should wrap in group div when group is true', () => {
        const wrapper = mount(VCFormInput, {
            props: { group: true },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.find('input').exists()).toBe(true);
    });

    it('should debounce update:modelValue when debounce prop is set', async () => {
        vi.useFakeTimers();
        try {
            const wrapper = mount(VCFormInput, {
                props: { modelValue: '', debounce: 200 },
                global: { plugins: [themePlugin] },
            });

            await wrapper.find('input').setValue('h');
            await wrapper.find('input').setValue('he');
            await wrapper.find('input').setValue('hey');

            expect(wrapper.emitted('update:modelValue')).toBeFalsy();

            await vi.advanceTimersByTimeAsync(200);

            const emitted = wrapper.emitted('update:modelValue')!;
            expect(emitted.length).toBe(1);
            expect(emitted[0]).toEqual(['hey']);
        } finally {
            vi.useRealTimers();
        }
    });

    it('should keep input value responsive while debounced', async () => {
        vi.useFakeTimers();
        try {
            const wrapper = mount(VCFormInput, {
                props: { modelValue: '', debounce: 200 },
                global: { plugins: [themePlugin] },
            });

            await wrapper.find('input').setValue('typed');
            // The displayed input value updates immediately regardless of debounce
            expect((wrapper.find('input').element as HTMLInputElement).value).toBe('typed');
        } finally {
            vi.useRealTimers();
        }
    });
});

describe('VCFormInputCheckbox', () => {
    it('should render a checkbox input', () => {
        const wrapper = mount(VCFormInputCheckbox, { global: { plugins: [themePlugin] } });
        expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
    });

    it('should emit toggled boolean value', async () => {
        const wrapper = mount(VCFormInputCheckbox, {
            props: { modelValue: false },
            global: { plugins: [themePlugin] },
        });

        await wrapper.find('input').trigger('input');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });

    it('should render label with stable id', () => {
        const wrapper = mount(VCFormInputCheckbox, {
            props: { label: true, labelContent: 'Check me' },
            global: { plugins: [themePlugin] },
        });
        const label = wrapper.find('label');
        const input = wrapper.find('input');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('Check me');
        expect(label.attributes('for')).toBe(input.attributes('id'));
    });

    it('should not mutate the original array for array modelValue', async () => {
        const original = ['a', 'b'];
        const wrapper = mount(VCFormInputCheckbox, {
            props: { modelValue: original },
            attrs: { value: 'c' },
            global: { plugins: [themePlugin] },
        });

        await wrapper.find('input').trigger('input');
        const emitted = wrapper.emitted('update:modelValue')![0][0] as string[];
        // The emitted value should be a new array
        expect(emitted).not.toBe(original);
        expect(emitted).toContain('c');
        // Original should be unchanged
        expect(original).toEqual(['a', 'b']);
    });
});

describe('VCFormSelect', () => {
    const options = [
        { id: '1', value: 'Option 1' },
        { id: '2', value: 'Option 2' },
    ];

    it('should render a select element', () => {
        const wrapper = mount(VCFormSelect, {
            props: { options },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('select').exists()).toBe(true);
    });

    it('should render default option when optionDefault is true', () => {
        const wrapper = mount(VCFormSelect, {
            props: { options, optionDefault: true },
            global: { plugins: [themePlugin] },
        });
        const opts = wrapper.findAll('option');
        expect(opts).toHaveLength(3); // default + 2
        expect(opts[0].text()).toBe('-- Select --');
    });

    it('should not render default option when optionDefault is false', () => {
        const wrapper = mount(VCFormSelect, {
            props: { options, optionDefault: false },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.findAll('option')).toHaveLength(2);
    });

    it('should render all options', () => {
        const wrapper = mount(VCFormSelect, {
            props: { options, optionDefault: false },
            global: { plugins: [themePlugin] },
        });
        const opts = wrapper.findAll('option');
        expect(opts[0].text()).toBe('Option 1');
        expect(opts[1].text()).toBe('Option 2');
    });
});

describe('VCFormTextarea', () => {
    it('should render a textarea', () => {
        const wrapper = mount(VCFormTextarea, { global: { plugins: [themePlugin] } });
        expect(wrapper.find('textarea').exists()).toBe(true);
    });

    it('should emit update:modelValue on input', async () => {
        const wrapper = mount(VCFormTextarea, {
            props: { modelValue: '' },
            global: { plugins: [themePlugin] },
        });
        await wrapper.find('textarea').setValue('text');
        expect(wrapper.emitted('update:modelValue')![0]).toEqual(['text']);
    });
});

describe('VCValidationGroup', () => {
    it('should render validation messages', () => {
        const wrapper = mount(VCValidationGroup, {
            props: { messages: { required: 'This field is required' } },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toContain('This field is required');
    });

    it('should render array-style messages', () => {
        const wrapper = mount(VCValidationGroup, {
            props: { messages: [{ key: 'min', value: 'Too short' }] },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toContain('Too short');
    });

    it('should render nothing when messages is empty', () => {
        const wrapper = mount(VCValidationGroup, {
            props: { messages: {} },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toBe('');
    });
});
