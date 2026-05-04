<script setup lang="ts">
import { VCBadge } from '@vuecs/elements';

const colors = ['primary', 'neutral', 'success', 'warning', 'error', 'info'] as const;
const variants = ['solid', 'soft', 'outline'] as const;
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div
            v-for="variant in variants"
            :key="variant"
            style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;"
        >
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted); width: 4rem;">
                {{ variant }}
            </span>
            <VCBadge
                v-for="color in colors"
                :key="`${variant}-${color}`"
                :variant="variant"
                :color="color"
            >
                {{ color }}
            </VCBadge>
        </div>
    </div>
</template>
