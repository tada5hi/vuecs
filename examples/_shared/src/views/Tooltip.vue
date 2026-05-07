<script setup lang="ts">
import {
    VCTooltip,
    VCTooltipArrow,
    VCTooltipContent,
    VCTooltipProvider,
    VCTooltipTrigger,
} from '@vuecs/overlays';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();
</script>

<template>
    <VCTooltipProvider :delay-duration="200">
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            <VCTooltip
                v-for="side in ['top', 'right', 'bottom', 'left'] as const"
                :key="side"
            >
                <VCTooltipTrigger class="vc-demo-button">
                    Hover ({{ side }})
                </VCTooltipTrigger>
                <VCTooltipContent
                    :side="side"
                    :side-offset="6"
                    :theme-variant="themeVariant"
                >
                    Tooltip on the {{ side }}
                    <VCTooltipArrow />
                </VCTooltipContent>
            </VCTooltip>
        </div>
    </VCTooltipProvider>
</template>

<style scoped>
.vc-demo-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    border: 1px solid var(--vc-color-border);
    background-color: var(--vc-color-bg);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
}
.vc-demo-button:hover {
    background-color: var(--vc-color-bg-muted);
}
</style>
