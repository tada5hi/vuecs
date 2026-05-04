<script setup lang="ts">
import {
    VCStepper,
    VCStepperDescription,
    VCStepperIndicator,
    VCStepperItem,
    VCStepperSeparator,
    VCStepperTitle,
    VCStepperTrigger,
} from '@vuecs/navigation';
import { ref } from 'vue';
import { variantState } from './iframe-bridge';

const current = ref(2);
const steps = [
    { title: 'Account', description: 'Create your profile' },
    { title: 'Address', description: 'Where to send things' },
    { title: 'Payment', description: 'Add a card' },
];
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 32rem;">
        <VCStepper
            v-model="current"
            :theme-variant="variantState"
        >
            <template
                v-for="(step, index) in steps"
                :key="index"
            >
                <VCStepperItem :step="index + 1">
                    <VCStepperTrigger>
                        <VCStepperIndicator>{{ index + 1 }}</VCStepperIndicator>
                    </VCStepperTrigger>
                    <div style="display: flex; flex-direction: column; gap: 0.125rem;">
                        <VCStepperTitle>{{ step.title }}</VCStepperTitle>
                        <VCStepperDescription>{{ step.description }}</VCStepperDescription>
                    </div>
                </VCStepperItem>
                <VCStepperSeparator v-if="index < steps.length - 1" />
            </template>
        </VCStepper>
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Current step: <code>{{ current }}</code>
        </p>
    </div>
</template>
