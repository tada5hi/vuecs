<script setup lang="ts">
import { VCBadge } from '@vuecs/elements';

withDefaults(defineProps<{
    size?: 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'soft' | 'outline';
    color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
}>(), {
    size: 'md',
    variant: 'soft',
    color: 'neutral',
});

const colors = ['primary', 'neutral', 'success', 'warning', 'error', 'info'] as const;
const variants = ['solid', 'soft', 'outline'] as const;
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Static color × variant grid — always visible so consumers see
             the full matrix at a glance. -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div
                v-for="v in variants"
                :key="v"
                style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;"
            >
                <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted); width: 4rem;">
                    {{ v }}
                </span>
                <VCBadge
                    v-for="c in colors"
                    :key="`${v}-${c}`"
                    :variant="v"
                    :color="c"
                >
                    {{ c }}
                </VCBadge>
            </div>
        </div>

        <!-- Playground badge — driven by the toolbar via top-level props. -->
        <div style="display: flex; gap: 0.5rem; align-items: center; padding-top: 0.5rem; border-top: 1px dashed var(--vc-color-border);">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted); width: 4rem;">
                playground
            </span>
            <VCBadge
                :size="size"
                :variant="variant"
                :color="color"
            >
                {{ color }}
            </VCBadge>
        </div>
    </div>
</template>
