<script setup lang="ts">
import { VCFormCheckbox, VCFormCheckboxGroup } from '@vuecs/forms';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const accepted = ref(false);
const indeterminateState = ref<boolean | 'indeterminate'>('indeterminate');
const selected = ref<string[]>(['a']);
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <!--
          Single checkbox — boolean v-model. Reka renders a real
          <button role="checkbox"> with `data-state="checked|unchecked|
          indeterminate"`. Pass `'indeterminate'` to opt into the
          tri-state.
        -->
        <VCFormCheckbox
            v-model="accepted"
            label-content="I accept the terms"
            :theme-variant="themeVariant"
        />
        <VCFormCheckbox
            v-model="indeterminateState"
            label-content="Indeterminate (tri-state)"
            :theme-variant="themeVariant"
        />

        <!--
          Group — array v-model. Each child <VCFormCheckbox value="..." />
          registers itself with the group; toggling pushes/pops its `value`
          on the bound array.
        -->
        <VCFormCheckboxGroup v-model="selected">
            <VCFormCheckbox
                value="a"
                label-content="Apples"
                :theme-variant="themeVariant"
            />
            <VCFormCheckbox
                value="b"
                label-content="Bananas"
                :theme-variant="themeVariant"
            />
            <VCFormCheckbox
                value="c"
                label-content="Cherries"
                :theme-variant="themeVariant"
            />
        </VCFormCheckboxGroup>

        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>accepted={{ accepted }}, indeterminate={{ indeterminateState }}, selected={{ selected }}</code>
        </p>
    </div>
</template>
