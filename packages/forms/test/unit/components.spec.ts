// @vitest-environment jsdom
import {
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { h, nextTick, ref } from 'vue';
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
import type { FieldValidation } from '../../src/components/type';

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
            props: { validationMessages: { required: 'Field is required' } },
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
            props: { validationMessages: { required: 'Required' } },
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

    it('should not render validation section when no messages and no validation slot', () => {
        // Content-driven visibility — empty (or absent) `validationMessages` AND
        // no `#validationGroup` / `#validationItem` slot ⇒ no `<VCValidationGroup>`
        // is rendered at all. The previous boolean visibility toggle
        // (`:render-validation`) was removed in favour of this.
        const wrapper = mount(VCFormGroup, {
            props: { hintContent: 'help' },
            global: { plugins: [themePlugin] },
        });
        expect(wrapper.text()).toBe('help');
    });

    it('should render validation section when only a validation slot is provided (no messages)', () => {
        // Slot consumers (`#validationGroup`) can render content from sources
        // other than `messages` — the slot's presence is enough to force-render
        // the section.
        const wrapper = mount(VCFormGroup, {
            global: { plugins: [themePlugin] },
            slots: { validationGroup: () => h('span', { class: 'slot-marker' }, 'slot content') },
        });
        expect(wrapper.find('.slot-marker').exists()).toBe(true);
    });

    it('should render in order: label, content, validation, hint', () => {
        const wrapper = mount(VCFormGroup, {
            props: {
                labelContent: 'Label',
                hintContent: 'Hint',
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

    describe(':validation bundle prop', () => {
        // The canonical bridge usage takes the return value of
        // `@ilingo/validup-vue`'s `useFieldValidation()`, whose shape is
        // `{ severity, messages, issues }` — the third key (`issues`) is the
        // raw `IssueTranslation[]` escape hatch. Vuecs only consumes
        // `severity` + `messages`; the extra key must be tolerated so
        // structural compatibility with the bridge holds without vuecs
        // taking a type-level dep on `@ilingo/validup-vue`.
        it('should ignore extra keys on the bundle object (bridge compatibility)', () => {
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'error' as const,
                        messages: [{ key: 'required', value: 'Email is required' }],
                        issues: [{ code: 'required' }],
                    } as any,
                },
                global: { plugins: [themePlugin] },
            });
            expect(wrapper.text()).toContain('Email is required');
        });

        it('should render messages from the bundle', () => {
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'error' as const,
                        messages: [{ key: 'required', value: 'Email is required' }],
                    },
                },
                global: { plugins: [themePlugin] },
            });
            expect(wrapper.text()).toContain('Email is required');
        });

        it('should apply error class for bundle severity=error', () => {
            const preset = { elements: { formGroup: { classes: { root: 'fg', validationError: 'is-err' } } } };
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'error' as const,
                        messages: [{ key: 'k', value: 'msg' }],
                    },
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
            expect(wrapper.classes()).toContain('is-err');
        });

        it('should apply warning class for bundle severity=warning', () => {
            const preset = {
                elements: {
                    formGroup: {
                        classes: {
                            root: 'fg', 
                            validationError: 'is-err', 
                            validationWarning: 'is-warn', 
                        }, 
                    }, 
                },
            };
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'warning' as const,
                        messages: [{ key: 'k', value: 'msg' }],
                    },
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
            expect(wrapper.classes()).toContain('is-warn');
            expect(wrapper.classes()).not.toContain('is-err');
        });

        it('should not apply any severity class when bundle severity is undefined (field pristine)', () => {
            // Legacy path defaults to error for undefined severity; bundle path
            // treats undefined as "field is OK" and applies no class.
            const preset = {
                elements: {
                    formGroup: {
                        classes: {
                            root: 'fg', 
                            validationError: 'is-err', 
                            validationWarning: 'is-warn', 
                        }, 
                    }, 
                },
            };
            const wrapper = mount(VCFormGroup, {
                props: { validation: { messages: [{ key: 'k', value: 'msg' }] } },
                global: {
                    plugins: [{
                        install: (app: any) => {
                            installThemeManager(app, { themes: [preset] });
                            installDefaultsManager(app);
                        },
                    }],
                },
            });
            expect(wrapper.classes()).not.toContain('is-err');
            expect(wrapper.classes()).not.toContain('is-warn');
        });

        it('should not apply any severity class for bundle severity=success', () => {
            const preset = {
                elements: {
                    formGroup: {
                        classes: {
                            root: 'fg', 
                            validationError: 'is-err', 
                            validationWarning: 'is-warn', 
                        }, 
                    }, 
                },
            };
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'success' as const,
                        messages: [{ key: 'k', value: 'msg' }],
                    },
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
            expect(wrapper.classes()).not.toContain('is-err');
            expect(wrapper.classes()).not.toContain('is-warn');
        });

        it('should take precedence over :validation-severity and :validation-messages', () => {
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'error' as const,
                        messages: [{ key: 'bundle', value: 'bundle wins' }],
                    },
                    validationSeverity: 'warning' as const,
                    validationMessages: { legacy: 'legacy loses' },
                },
                global: { plugins: [themePlugin] },
            });
            expect(wrapper.text()).toContain('bundle wins');
            expect(wrapper.text()).not.toContain('legacy loses');
        });

        it('should fall through to legacy props when :validation is null', () => {
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: null,
                    validationMessages: { req: 'legacy msg' },
                },
                global: { plugins: [themePlugin] },
            });
            expect(wrapper.text()).toContain('legacy msg');
        });

        it('should not render validation section when bundle messages are empty', () => {
            // Bundle with empty `messages` ⇒ no section (content-driven
            // visibility). Matches the typical "field is pristine / valid"
            // case from `@ilingo/validup-vue`'s `useFieldValidation`, which
            // returns `{ severity: undefined, messages: [], issues: [] }`.
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: undefined,
                        messages: [],
                    },
                    hintContent: 'help',
                },
                global: { plugins: [themePlugin] },
            });
            expect(wrapper.text()).toBe('help');
        });
    });

    describe('severity context propagation', () => {
        // Theme with severity variants that paint a unique class on the
        // input's root — used as a fingerprint to verify the FormGroup's
        // severity flows down to the input.
        const severityPreset = {
            elements: {
                formInput: {
                    classes: { root: 'base-input' },
                    variants: {
                        severity: {
                            error: { root: 'severity-error-class' },
                            warning: { root: 'severity-warning-class' },
                        },
                    },
                },
            },
        };

        const buildPlugin = () => ({
            install: (app: any) => {
                installThemeManager(app, { themes: [severityPreset] });
                installDefaultsManager(app);
            },
        });

        it('should propagate error severity from FormGroup to child input', () => {
            const wrapper = mount(VCFormGroup, {
                props: {
                    // Array-style `messages` matches the canonical
                    // `FieldValidation` contract — what `@ilingo/validup-vue`'s
                    // `useFieldValidation()` produces in real-world usage.
                    validation: {
                        severity: 'error',
                        messages: [{ key: 'required', value: 'Required' }],
                    },
                },
                global: { plugins: [buildPlugin()] },
                slots: { default: () => h(VCFormInput) },
            });
            expect(wrapper.find('input').classes()).toContain('severity-error-class');
        });

        it('should propagate warning severity from FormGroup to child input', () => {
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'warning',
                        messages: [{ key: 'soft', value: 'Heads up' }],
                    },
                },
                global: { plugins: [buildPlugin()] },
                slots: { default: () => h(VCFormInput) },
            });
            expect(wrapper.find('input').classes()).toContain('severity-warning-class');
        });

        it('should not apply any severity class when bundle severity is undefined (pristine)', () => {
            const wrapper = mount(VCFormGroup, {
                props: {
                    // No severity + empty `messages` array — the FieldValidation
                    // bundle's "pristine / success" state. The input picks up no
                    // inherited severity.
                    validation: { severity: undefined, messages: [] },
                },
                global: { plugins: [buildPlugin()] },
                slots: { default: () => h(VCFormInput) },
            });
            const inputClasses = wrapper.find('input').classes();
            expect(inputClasses).not.toContain('severity-error-class');
            expect(inputClasses).not.toContain('severity-warning-class');
        });

        it('should not inherit severity when input is mounted outside a FormGroup', () => {
            const wrapper = mount(VCFormInput, { global: { plugins: [buildPlugin()] } });
            const inputClasses = wrapper.find('input').classes();
            expect(inputClasses).toContain('base-input');
            expect(inputClasses).not.toContain('severity-error-class');
            expect(inputClasses).not.toContain('severity-warning-class');
        });

        it('should let per-instance themeVariant.severity override the inherited one', () => {
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'error',
                        messages: [{ key: 'e', value: 'parent says error' }],
                    },
                },
                global: { plugins: [buildPlugin()] },
                slots: {
                    // Per-instance forces 'warning' — should win over the
                    // FormGroup's 'error' context per the documented
                    // "per-instance wins" contract.
                    default: () => h(VCFormInput, { themeVariant: { severity: 'warning' } }),
                },
            });
            const inputClasses = wrapper.find('input').classes();
            expect(inputClasses).toContain('severity-warning-class');
            expect(inputClasses).not.toContain('severity-error-class');
        });

        it('should treat per-instance themeVariant.severity: undefined as an explicit opt-out', () => {
            // Documented escape hatch — passing `severity: undefined`
            // explicitly (any key, even with undefined value) opts the
            // input out of inheriting the FormGroup's severity. Pins
            // down the `'severity' in own` check; switching to
            // `own.severity !== undefined` would silently regress this.
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'error',
                        messages: [{ key: 'e', value: 'parent says error' }],
                    },
                },
                global: { plugins: [buildPlugin()] },
                slots: { default: () => h(VCFormInput, { themeVariant: { severity: undefined } }) },
            });
            const inputClasses = wrapper.find('input').classes();
            expect(inputClasses).not.toContain('severity-error-class');
            expect(inputClasses).not.toContain('severity-warning-class');
        });

        it('should fall back to error severity for legacy :validation-messages with no explicit :validation-severity', () => {
            // FormGroup's render-side `validationClass` computation falls
            // back to the error class when consumers use the legacy props
            // path with non-empty `validationMessages` but no
            // `validationSeverity`. The context mirrors that fallback so
            // the child input border tracks the (red) FormGroup root
            // instead of staying neutral.
            const wrapper = mount(VCFormGroup, {
                props: { validationMessages: { required: 'Required' } },
                global: { plugins: [buildPlugin()] },
                slots: { default: () => h(VCFormInput) },
            });
            expect(wrapper.find('input').classes()).toContain('severity-error-class');
        });

        it('should propagate severity from the legacy :validation-severity prop', () => {
            // Consumers still on the deprecated pre-bundle API should
            // see the same context-driven input border colouring as
            // bundle consumers — the context's getter falls through to
            // `validationSeverity` when `:validation` is not set.
            const wrapper = mount(VCFormGroup, {
                props: {
                    validationSeverity: 'error',
                    validationMessages: { required: 'Required' },
                },
                global: { plugins: [buildPlugin()] },
                slots: { default: () => h(VCFormInput) },
            });
            expect(wrapper.find('input').classes()).toContain('severity-error-class');
        });

        it('should forward-compat \'success\' severity even though shipping themes have no class for it today', () => {
            // The context union includes 'success'. Themes can declare
            // a `severity.success` variant; the helper plumbs it through.
            // Light up a custom green class to verify the wiring.
            const successPreset = {
                elements: {
                    formInput: {
                        classes: { root: 'base-input' },
                        variants: { severity: { success: { root: 'severity-success-class' } } },
                    },
                },
            };
            const wrapper = mount(VCFormGroup, {
                props: {
                    validation: {
                        severity: 'success',
                        messages: [{ key: 'ok', value: 'looks good' }],
                    },
                },
                global: {
                    plugins: [{
                        install: (app: any) => {
                            installThemeManager(app, { themes: [successPreset] });
                            installDefaultsManager(app);
                        },
                    }],
                },
                slots: { default: () => h(VCFormInput) },
            });
            expect(wrapper.find('input').classes()).toContain('severity-success-class');
        });

        it('should react to FormGroup :validation changes after mount', async () => {
            // Mounting with a pristine bundle, then mutating the bundle's
            // severity, should re-render the child input with the new
            // class — the context's function-valued severity getter
            // tracks Vue's reactive deps through `useComponentTheme`.
            const validation = ref<FieldValidation | null>({
                severity: undefined,
                messages: [],
            });
            const wrapper = mount(VCFormGroup, {
                props: { validation: validation.value },
                global: { plugins: [buildPlugin()] },
                slots: { default: () => h(VCFormInput) },
            });
            // Initial state — pristine, no severity class.
            expect(wrapper.find('input').classes()).not.toContain('severity-error-class');
            expect(wrapper.find('input').classes()).not.toContain('severity-warning-class');

            // Mutate the bundle in place (the underlying reactive that
            // `useFieldValidation` produces does this on every $errors
            // change — verifying the reactive chain).
            validation.value = { severity: 'error', messages: [{ key: 'f', value: 'failed' }] };
            await wrapper.setProps({ validation: validation.value });
            await nextTick();
            expect(wrapper.find('input').classes()).toContain('severity-error-class');

            // And again — error → warning.
            validation.value = { severity: 'warning', messages: [{ key: 'p', value: 'pending' }] };
            await wrapper.setProps({ validation: validation.value });
            await nextTick();
            expect(wrapper.find('input').classes()).toContain('severity-warning-class');
            expect(wrapper.find('input').classes()).not.toContain('severity-error-class');
        });

        it('should let an inner FormGroup override an outer one (nested groups)', () => {
            // Stacked `<VCFormGroup>`s — the inner provider wins because
            // Vue's `provide` shadows the outer key. Unusual layout but
            // worth nailing down behaviour.
            const Outer = {
                template: `
                    <VCFormGroup :validation="{ severity: 'error', messages: [{ key: 'e', value: 'outer' }] }">
                        <VCFormGroup :validation="{ severity: 'warning', messages: [{ key: 'w', value: 'inner' }] }">
                            <VCFormInput />
                        </VCFormGroup>
                    </VCFormGroup>
                `,
                components: { VCFormGroup, VCFormInput },
            };
            const wrapper = mount(Outer, { global: { plugins: [buildPlugin()] } });
            expect(wrapper.find('input').classes()).toContain('severity-warning-class');
            expect(wrapper.find('input').classes()).not.toContain('severity-error-class');
        });
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

    it('should colour each message via the severity variant', () => {
        // The `:severity` prop is folded into `themeVariant.severity`
        // by `useThemeProps`. With a theme that declares matching
        // `severity` variants on `validationGroup.item`, each rendered
        // message picks up the matching colour — so warning messages
        // turn amber instead of inheriting the base 'red' colour that
        // was applied unconditionally before.
        const preset = {
            elements: {
                validationGroup: {
                    classes: { item: 'msg-base' },
                    variants: {
                        severity: {
                            error: { item: 'msg-error' },
                            warning: { item: 'msg-warning' },
                            success: { item: 'msg-success' },
                        },
                    },
                },
            },
        };
        const buildPlugin = () => ({
            install: (app: any) => {
                installThemeManager(app, { themes: [preset] });
                installDefaultsManager(app);
            },
        });
        const warningWrapper = mount(VCValidationGroup, {
            props: {
                severity: 'warning',
                messages: [{ key: 'p', value: 'pending' }],
            },
            global: { plugins: [buildPlugin()] },
        });
        const item = warningWrapper.find('div');
        expect(item.classes()).toContain('msg-warning');
        expect(item.classes()).not.toContain('msg-error');

        const errorWrapper = mount(VCValidationGroup, {
            props: {
                severity: 'error',
                messages: [{ key: 'f', value: 'failed' }],
            },
            global: { plugins: [buildPlugin()] },
        });
        expect(errorWrapper.find('div').classes()).toContain('msg-error');
    });
});
