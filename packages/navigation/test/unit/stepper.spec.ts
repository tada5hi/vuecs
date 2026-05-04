// @vitest-environment jsdom
import {
    afterEach, 
    describe, 
    expect, 
    it,
} from 'vitest';
import {
    defineComponent, 
    h, 
    nextTick, 
    ref,
} from 'vue';
import { mount } from '@vue/test-utils';
import vuecsNav, {
    VCStepper,
    VCStepperIndicator,
    VCStepperItem,
    VCStepperTitle,
    VCStepperTrigger,
} from '../../src';

function buildApp(value = ref(1), linear = false) {
    return mount(defineComponent({
        setup() {
            return () => h(VCStepper, {
                modelValue: value.value,
                // Reka's StepperRoot defaults `linear: true`, which would
                // block the click-to-step-3-from-step-1 assertion below.
                // The default-build test exercises non-linear navigation.
                linear,
                'onUpdate:modelValue': (next: number | undefined) => { value.value = next ?? 1; },
            }, {
                default: () => [1, 2, 3].map((step) => h(VCStepperItem, { key: step, step }, {
                    default: () => [
                        h(VCStepperTrigger, { 'data-testid': `trigger-${step}` }, () => h(
                            VCStepperIndicator,
                            null,
                            () => String(step),
                        )),
                        h(VCStepperTitle, null, () => `Step ${step}`),
                    ],
                })),
            });
        },
    }), {
        global: { plugins: [[vuecsNav, {}]] },
        attachTo: document.body,
    });
}

describe('<VCStepper>', () => {
    afterEach(() => { document.body.innerHTML = ''; });

    it('renders an item per step with the active state on the model value', async () => {
        const value = ref(2);
        const wrapper = buildApp(value);
        await nextTick();
        const items = wrapper.findAll('[data-state]');
        // Each step item carries `data-state`. The 2nd step should be active.
        expect(items.length).toBeGreaterThanOrEqual(3);
        const triggers = wrapper.findAll('[data-testid^="trigger-"]');
        expect(triggers).toHaveLength(3);
        // Step 1 is completed, step 2 active, step 3 inactive — Reka exposes
        // these on each `StepperItem` via `data-state`.
        const itemStates = wrapper.findAll('.vc-stepper-item').map((el) => (el.element as HTMLElement).dataset.state);
        expect(itemStates).toEqual(['completed', 'active', 'inactive']);
    });

    it('updates v-model when a step trigger is mousedown-ed', async () => {
        const value = ref(1);
        const wrapper = buildApp(value);
        await nextTick();
        // Reka's StepperTrigger listens for `@mousedown.left`, not `click` —
        // dispatch the matching event with `button: 0` (left).
        await wrapper.find('[data-testid="trigger-3"]').trigger('mousedown', { button: 0 });
        await nextTick();
        expect(value.value).toBe(3);
    });
});
