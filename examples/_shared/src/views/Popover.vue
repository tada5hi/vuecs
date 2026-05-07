<script setup lang="ts">
import {
    VCPopover,
    VCPopoverArrow,
    VCPopoverClose,
    VCPopoverContent,
    VCPopoverTrigger,
} from '@vuecs/overlays';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();
</script>

<template>
    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
        <VCPopover
            v-for="side in ['top', 'right', 'bottom', 'left'] as const"
            :key="side"
        >
            <VCPopoverTrigger class="vc-demo-button">
                {{ side }}
            </VCPopoverTrigger>
            <VCPopoverContent
                :side="side"
                :side-offset="8"
                :theme-variant="themeVariant"
            >
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                    <p style="margin: 0; font-size: 0.875rem; font-weight: 600;">
                        {{ side }} popover
                    </p>
                    <p style="margin: 0; font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                        Anchored to the trigger; floating-ui flips and shifts so it stays on-screen.
                    </p>
                </div>
                <VCPopoverArrow />
                <VCPopoverClose />
            </VCPopoverContent>
        </VCPopover>
    </div>
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
