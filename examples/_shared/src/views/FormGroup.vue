<script setup lang="ts">
import {
    type FieldValidation,
    type FormOption,
    VCFormGroup,
    VCFormInput,
    VCFormSelect,
    VCFormTextarea,
} from '@vuecs/forms';
import { computed, ref } from 'vue';

/**
 * Demonstrates `<VCFormGroup :validation>` propagating severity down
 * to the wrapped form-input — the border (and focus ring) repaint in
 * sync with the message, no per-input `:theme-variant="{ severity }"`
 * wiring required.
 *
 * No validation library is wired in here to keep the demo
 * dependency-free; instead, the cycle button steps through four
 * representative `FieldValidation` bundles to show each visual state:
 *
 *   pristine → warning → error → success → pristine
 *
 * In real apps, the bundle comes from `@ilingo/validup-vue`'s
 * `useFieldValidation()` (or any equivalent bridge) — its return
 * shape matches the `FieldValidation` type used below.
 */

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const value = ref('hello');
const description = ref('');
const role = ref<string | undefined>(undefined);

// Setup-side const, matching the canonical FormSelect demo's
// pattern. Inline `:options="[…]"` in the template also works, but
// hoisting keeps the array reference stable across renders.
const roles: FormOption[] = [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' },
];

type State = 'pristine' | 'warning' | 'error' | 'success';
const stateOrder: State[] = ['pristine', 'warning', 'error', 'success'];
const stateIndex = ref(0);
const state = computed<State>(() => stateOrder[stateIndex.value]!);

const cycle = () => {
    stateIndex.value = (stateIndex.value + 1) % stateOrder.length;
};

const bundle = computed<FieldValidation | null>(() => {
    switch (state.value) {
        case 'pristine':
            // No severity, no messages — input renders with default border.
            return { severity: undefined, messages: [] };
        case 'warning':
            // Validation in flight (or pre-touch hint) — amber border, optional message.
            return {
                severity: 'warning',
                messages: [{ key: 'pending', value: 'Looks unusual — double-check this value' }],
            };
        case 'error':
            // Failed validation — red border + red message.
            return {
                severity: 'error',
                messages: [{ key: 'required', value: 'This field is required' }],
            };
        case 'success':
            // Passed (forward-compat — no shipping theme has a success class yet,
            // so the border stays default; the message text still renders).
            return {
                severity: 'success',
                messages: [{ key: 'ok', value: 'Looks good' }],
            };
        default:
            return null;
    }
});
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 32rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button
                type="button"
                style="
                    padding: 0.25rem 0.75rem;
                    border: 1px solid var(--vc-color-border);
                    border-radius: 0.375rem;
                    background: var(--vc-color-bg);
                    cursor: pointer;
                    font-size: 0.875rem;
                "
                @click="cycle"
            >
                Cycle state →
            </button>
            <span style="font-size: 0.875rem; color: var(--vc-color-fg-muted);">
                Current: <code>{{ state }}</code>
            </span>
        </div>

        <!--
          A single FormGroup-wrapped input. The `:validation` bundle is
          rebuilt by `cycle()` above. The input picks up the matching
          severity variant from the active theme (border + focus ring)
          *and* the message text below — both driven by the same
          single prop on the FormGroup. No per-input wiring.
        -->
        <VCFormGroup
            :validation="bundle"
            label-content="Email"
        >
            <VCFormInput
                v-model="value"
                placeholder="you@example.com"
                :theme-variant="themeVariant"
            />
        </VCFormGroup>

        <!--
          A textarea — same story. Every shipping form-input component
          consumes the FormGroup context, so any input you drop inside
          a FormGroup automatically tracks its severity.
        -->
        <VCFormGroup
            :validation="bundle"
            label-content="Description"
        >
            <VCFormTextarea
                v-model="description"
                rows="3"
                placeholder="Tell us about yourself"
                :theme-variant="themeVariant"
            />
        </VCFormGroup>

        <!--
          And a select. Severity flows the same way; theme-bulma uses
          its native `.is-danger` / `.is-warning` states, theme-tailwind
          uses the `border-error/warning-500` ring, theme-bootstrap uses
          `.is-invalid` (no warning-soft state — BS5 limitation, both
          severities collapse to red).
        -->
        <VCFormGroup
            :validation="bundle"
            label-content="Role"
        >
            <VCFormSelect
                v-model="role"
                :options="roles"
                placeholder="-- Pick a role --"
                :theme-variant="themeVariant"
            />
        </VCFormGroup>

        <!--
          Per-instance opt-out — passing `severity: undefined` explicitly
          blocks inheritance even when the surrounding FormGroup has a
          severity. This input always renders with its default border,
          regardless of which state the demo is cycled to.
        -->
        <VCFormGroup
            :validation="bundle"
            label-content="Always neutral (opt-out)"
        >
            <VCFormInput
                model-value="opted out"
                placeholder="ignores the FormGroup's severity"
                :theme-variant="{ ...themeVariant, severity: undefined }"
            />
        </VCFormGroup>

        <p style="font-size: 0.8125rem; color: var(--vc-color-fg-muted); margin: 0;">
            Click <strong>Cycle state</strong> to step through pristine → warning → error → success.
            The first three inputs all repaint together; the last one is opted-out via
            <code>:theme-variant="{ severity: undefined }"</code> and stays neutral.
        </p>
    </div>
</template>
