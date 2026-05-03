// @vitest-environment jsdom
import {
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { installDefaultsManager, installThemeManager } from '@vuecs/core';
import { default as VCFormCheckbox } from '../../src/components/form-checkbox/FormCheckbox.vue';
import { default as VCFormCheckboxGroup } from '../../src/components/form-checkbox-group/FormCheckboxGroup.vue';
import { default as VCFormGroup } from '../../src/components/form-group/FormGroup.vue';
import { default as VCFormInput } from '../../src/components/form-input/FormInput.vue';
import { default as VCFormNumber } from '../../src/components/form-number/FormNumber.vue';
import { default as VCFormPin } from '../../src/components/form-pin/FormPin.vue';
import { default as VCFormRadio } from '../../src/components/form-radio/FormRadio.vue';
import { default as VCFormRadioGroup } from '../../src/components/form-radio-group/FormRadioGroup.vue';
import { default as VCFormSelect } from '../../src/components/form-select/FormSelect.vue';
import { default as VCFormSlider } from '../../src/components/form-slider/FormSlider.vue';
import { default as VCFormSwitch } from '../../src/components/form-switch/FormSwitch.vue';
import { default as VCFormTags } from '../../src/components/form-tags/FormTags.vue';
import { default as VCFormTextarea } from '../../src/components/form-textarea/FormTextarea.vue';
import { default as VCValidationGroup } from '../../src/components/validation-group/ValidationGroup.vue';

// Reka's `useSize` (used by Slider) constructs a `ResizeObserver`. jsdom does
// not implement it. Reka's `SelectTrigger` calls `target.hasPointerCapture`
// inside its `pointerdown` handler — also missing from jsdom. Both stubs are
// no-ops; their presence is what matters so the call doesn't throw and abort
// Reka's open flow.
beforeAll(() => {
    if (typeof globalThis.ResizeObserver === 'undefined') {
        globalThis.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof globalThis.ResizeObserver;
    }
    if (typeof Element !== 'undefined' && !Element.prototype.hasPointerCapture) {
        Element.prototype.hasPointerCapture = () => false;
        Element.prototype.setPointerCapture = () => {};
        Element.prototype.releasePointerCapture = () => {};
        Element.prototype.scrollIntoView = () => {};
    }
});

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

describe('VCFormCheckbox', () => {
    it('should render a Reka checkbox button (role="checkbox")', () => {
        const wrapper = mount(VCFormCheckbox, { global: { plugins: [themePlugin] } });
        expect(wrapper.find('button[role="checkbox"]').exists()).toBe(true);
    });

    it('should emit boolean toggle on click', async () => {
        const wrapper = mount(VCFormCheckbox, {
            props: { modelValue: false },
            global: { plugins: [themePlugin] },
        });

        await wrapper.find('button[role="checkbox"]').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });

    it('should render label with stable id linking to the checkbox button', () => {
        const wrapper = mount(VCFormCheckbox, {
            props: { label: true, labelContent: 'Check me' },
            global: { plugins: [themePlugin] },
        });
        const label = wrapper.find('label');
        const button = wrapper.find('button[role="checkbox"]');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('Check me');
        expect(label.attributes('for')).toBe(button.attributes('id'));
    });

    it('should support indeterminate modelValue', () => {
        const wrapper = mount(VCFormCheckbox, {
            props: { modelValue: 'indeterminate' as const },
            global: { plugins: [themePlugin] },
        });
        const btn = wrapper.find('button[role="checkbox"]');
        expect(btn.attributes('data-state')).toBe('indeterminate');
    });

    it('should respect disabled prop', () => {
        const wrapper = mount(VCFormCheckbox, {
            props: { disabled: true },
            global: { plugins: [themePlugin] },
        });
        const btn = wrapper.find('button[role="checkbox"]');
        expect(btn.attributes('disabled')).toBeDefined();
    });
});

describe('VCFormCheckboxGroup', () => {
    it('should accept array modelValue and emit array updates from child checkboxes', async () => {
        const wrapper = mount(VCFormCheckboxGroup, {
            props: { modelValue: ['a'] },
            global: { plugins: [themePlugin] },
            slots: {
                default: () => [
                    h(VCFormCheckbox, { value: 'a', label: false }),
                    h(VCFormCheckbox, { value: 'b', label: false }),
                ],
            },
        });

        const checkboxes = wrapper.findAll('button[role="checkbox"]');
        expect(checkboxes).toHaveLength(2);

        // Click the unchecked one — group should emit array including its value.
        await checkboxes[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        const emitted = wrapper.emitted('update:modelValue')![0][0] as string[];
        expect(emitted).toContain('b');
    });

    it('should default to vertical orientation', () => {
        const wrapper = mount(VCFormCheckboxGroup, {
            props: { modelValue: [] },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.element.getAttribute('data-orientation')).toBe('vertical');
    });
});

describe('VCFormSwitch', () => {
    it('should render a Reka switch button (role="switch")', () => {
        const wrapper = mount(VCFormSwitch, { global: { plugins: [themePlugin] } });
        expect(wrapper.find('button[role="switch"]').exists()).toBe(true);
    });

    it('should emit boolean toggle on click', async () => {
        const wrapper = mount(VCFormSwitch, {
            props: { modelValue: false },
            global: { plugins: [themePlugin] },
        });
        await wrapper.find('button[role="switch"]').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });

    it('should render label linked to the switch by id', () => {
        const wrapper = mount(VCFormSwitch, {
            props: { label: true, labelContent: 'Enable' },
            global: { plugins: [themePlugin] },
        });
        const label = wrapper.find('label');
        const button = wrapper.find('button[role="switch"]');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('Enable');
        expect(label.attributes('for')).toBe(button.attributes('id'));
    });
});

describe('VCFormSelect', () => {
    // Reka's Select mounts dropdown contents in a portal under document.body
    // only after open. We `attachTo: document.body` and click the trigger to
    // drive the open flow, then query `document.body` for the portal contents.
    const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
    ];

    let activeWrapper: ReturnType<typeof mount> | null = null;
    afterEach(async () => {
        // Reka schedules microtasks (e.g. closing the dropdown after a pick)
        // that try to insertBefore on the teleport target. Unmount + flush
        // before nuking the body so those updates resolve cleanly.
        if (activeWrapper) {
            activeWrapper.unmount();
            activeWrapper = null;
        }
        await nextTick();
        document.body.innerHTML = '';
    });

    const openSelect = async (wrapper: ReturnType<typeof mount>) => {
        activeWrapper = wrapper;
        // Reka's SelectTrigger opens on `pointerdown` (not `click`). Triggering
        // a synthetic `click` doesn't dispatch the pointer events jsdom needs.
        const trigger = wrapper.find('button[role="combobox"]');
        await trigger.trigger('pointerdown');
        await trigger.trigger('pointerup');
        await nextTick();
        await nextTick();
    };

    it('should render a button trigger with role="combobox"', () => {
        const wrapper = mount(VCFormSelect, {
            props: { options },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[role="combobox"]').exists()).toBe(true);
    });

    it('should show placeholder text in the trigger when no value is selected', () => {
        const wrapper = mount(VCFormSelect, {
            props: { options, placeholder: 'Pick one' },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('button[role="combobox"]').text()).toContain('Pick one');
    });

    it('should show the matching option label in the trigger when modelValue is set', async () => {
        const wrapper = mount(VCFormSelect, {
            props: { options, modelValue: '2' },
            global: { plugins: [themePlugin] },
        });
        // SelectValue resolves the displayed label asynchronously after
        // SelectItem registers its text — wait one tick.
        await nextTick();
        expect(wrapper.find('button[role="combobox"]').text()).toContain('Option 2');
    });

    it('should respect the disabled prop on the trigger', () => {
        const wrapper = mount(VCFormSelect, {
            props: { options, disabled: true },
            global: { plugins: [themePlugin] },
        });
        const trigger = wrapper.find('button[role="combobox"]');
        expect(trigger.attributes('disabled')).toBeDefined();
    });

    it('should render every option as a SelectItem when opened', async () => {
        const wrapper = mount(VCFormSelect, {
            props: { options },
            global: { plugins: [themePlugin] },
            attachTo: document.body,
        });
        await openSelect(wrapper);
        const items = document.body.querySelectorAll('[role="option"]');
        expect(items.length).toBe(2);
        expect(items[0].textContent).toContain('Option 1');
        expect(items[1].textContent).toContain('Option 2');
    });

    it('should render groups with their label and options', async () => {
        const grouped = [
            {
                label: 'Americas',
                options: [
                    { value: 'us', label: 'United States' },
                    { value: 'br', label: 'Brazil' },
                ],
            },
            {
                label: 'Europe',
                options: [
                    { value: 'de', label: 'Germany' },
                ],
            },
        ];
        const wrapper = mount(VCFormSelect, {
            props: { options: grouped },
            global: { plugins: [themePlugin] },
            attachTo: document.body,
        });
        await openSelect(wrapper);
        const text = document.body.textContent || '';
        expect(text).toContain('Americas');
        expect(text).toContain('Europe');
        const items = document.body.querySelectorAll('[role="option"]');
        expect(items.length).toBe(3);
    });

    it('should mark options inside a disabled group as disabled', async () => {
        const grouped = [
            {
                label: 'Disabled',
                disabled: true,
                options: [
                    { value: 'a', label: 'A' },
                    { value: 'b', label: 'B' },
                ],
            },
        ];
        const wrapper = mount(VCFormSelect, {
            props: { options: grouped },
            global: { plugins: [themePlugin] },
            attachTo: document.body,
        });
        await openSelect(wrapper);
        const items = document.body.querySelectorAll('[role="option"]');
        expect(items.length).toBe(2);
        items.forEach((item) => {
            expect(item.getAttribute('data-disabled')).not.toBeNull();
        });
    });

    it('should respect the disabled flag on individual options', async () => {
        const wrapper = mount(VCFormSelect, {
            props: {
                options: [
                    { value: 'a', label: 'A' },
                    {
                        value: 'b', 
                        label: 'B', 
                        disabled: true, 
                    },
                ],
            },
            global: { plugins: [themePlugin] },
            attachTo: document.body,
        });
        await openSelect(wrapper);
        const items = document.body.querySelectorAll('[role="option"]');
        expect(items[0].getAttribute('data-disabled')).toBeNull();
        expect(items[1].getAttribute('data-disabled')).not.toBeNull();
    });

    it('should emit update:modelValue when an option is picked', async () => {
        const wrapper = mount(VCFormSelect, {
            props: { options },
            global: { plugins: [themePlugin] },
            attachTo: document.body,
        });
        await openSelect(wrapper);
        const items = document.body.querySelectorAll<HTMLElement>('[role="option"]');
        // Reka SelectItem selects on `pointerup` (not `click`). Dispatch a real
        // PointerEvent so Reka's handler accepts it; selection runs in a
        // microtask so we need to await a few ticks.
        items[1].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        items[1].dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        await nextTick();
        await nextTick();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![0]).toEqual(['2']);
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

describe('VCFormRadioGroup + VCFormRadio', () => {
    it('should render a Reka RadioGroup root with role="radiogroup"', () => {
        const wrapper = mount(VCFormRadioGroup, {
            props: { modelValue: 'a' },
            global: { plugins: [themePlugin] },
            slots: {
                default: () => [
                    h(VCFormRadio, { value: 'a', label: false }),
                    h(VCFormRadio, { value: 'b', label: false }),
                ],
            },
        });
        expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true);
        const radios = wrapper.findAll('button[role="radio"]');
        expect(radios).toHaveLength(2);
    });

    it('should emit selected value on click', async () => {
        const wrapper = mount(VCFormRadioGroup, {
            props: { modelValue: undefined },
            global: { plugins: [themePlugin] },
            slots: {
                default: () => [
                    h(VCFormRadio, { value: 'a', label: false }),
                    h(VCFormRadio, { value: 'b', label: false }),
                ],
            },
        });
        const radios = wrapper.findAll('button[role="radio"]');
        await radios[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')![0]).toEqual(['b']);
    });

    it('should render options[] shorthand as VCFormRadio children', () => {
        const wrapper = mount(VCFormRadioGroup, {
            props: {
                modelValue: undefined,
                options: [
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                ],
            },
            global: { plugins: [themePlugin] },
        });
        const radios = wrapper.findAll('button[role="radio"]');
        expect(radios).toHaveLength(3);
        expect(wrapper.text()).toContain('Small');
        expect(wrapper.text()).toContain('Medium');
        expect(wrapper.text()).toContain('Large');
    });
});

describe('VCFormPin', () => {
    // Reka renders an extra `aria-hidden` <input> for native form submission
    // alongside the visible cells. Skip it.
    const visibleCells = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('input').filter(
        (w) => w.attributes('aria-hidden') !== 'true',
    );

    it('should render `length` cell inputs', () => {
        const wrapper = mount(VCFormPin, {
            props: { length: 4 },
            global: { plugins: [themePlugin] },
        });
        expect(visibleCells(wrapper)).toHaveLength(4);
    });

    it('should respect type="number" inputmode', () => {
        const wrapper = mount(VCFormPin, {
            props: { length: 6, type: 'number' },
            global: { plugins: [themePlugin] },
        });
        const cells = visibleCells(wrapper);
        expect(cells[0].attributes('inputmode')).toBe('numeric');
    });
});

describe('VCFormSlider', () => {
    it('should render with one thumb for scalar modelValue', () => {
        const wrapper = mount(VCFormSlider, {
            props: {
                modelValue: 50, 
                min: 0, 
                max: 100, 
            },
            global: { plugins: [themePlugin] },
        });
        const thumbs = wrapper.findAll('[role="slider"]');
        expect(thumbs).toHaveLength(1);
    });

    it('should render with two thumbs for [a, b] modelValue', () => {
        const wrapper = mount(VCFormSlider, {
            props: {
                modelValue: [20, 80], 
                min: 0, 
                max: 100, 
            },
            global: { plugins: [themePlugin] },
        });
        const thumbs = wrapper.findAll('[role="slider"]');
        expect(thumbs).toHaveLength(2);
    });
});

describe('VCFormNumber', () => {
    it('should render input + decrement + increment by default', () => {
        const wrapper = mount(VCFormNumber, {
            props: { modelValue: 5 },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('input').exists()).toBe(true);
        const buttons = wrapper.findAll('button');
        expect(buttons).toHaveLength(2);
    });

    it('should hide steppers when steppers=false', () => {
        const wrapper = mount(VCFormNumber, {
            props: { modelValue: 5, steppers: false },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.find('input').exists()).toBe(true);
        expect(wrapper.findAll('button')).toHaveLength(0);
    });
});

describe('VCFormTags', () => {
    it('should render initial tags + an input cell', () => {
        const wrapper = mount(VCFormTags, {
            props: { modelValue: ['vue', 'reka'] },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toContain('vue');
        expect(wrapper.text()).toContain('reka');
        expect(wrapper.find('input').exists()).toBe(true);
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
