<script setup lang="ts">
import { VCFormRadio, VCFormRadioGroup } from '@vuecs/forms';
import { ref } from 'vue';
import { variantState } from './iframe-bridge';

const size = ref<string>('md');
const region = ref<string | undefined>(undefined);
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">Compound children</span>
            <VCFormRadioGroup v-model="size">
                <VCFormRadio
                    value="sm"
                    label-content="Small"
                    :theme-variant="variantState"
                />
                <VCFormRadio
                    value="md"
                    label-content="Medium"
                    :theme-variant="variantState"
                />
                <VCFormRadio
                    value="lg"
                    label-content="Large"
                    :theme-variant="variantState"
                />
            </VCFormRadioGroup>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">Options shorthand</span>
            <VCFormRadioGroup
                v-model="region"
                :options="[
                    { value: 'us', label: 'United States' },
                    { value: 'eu', label: 'Europe' },
                    { value: 'apac', label: 'Asia-Pacific' },
                ]"
            />
        </div>

        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Bound: <code>size={{ size }}, region={{ region }}</code>
        </p>
    </div>
</template>
