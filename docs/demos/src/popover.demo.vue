<script setup lang="ts">
import {
    VCPopover,
    VCPopoverArrow,
    VCPopoverClose,
    VCPopoverContent,
    VCPopoverTrigger,
} from '@vuecs/overlays';
</script>

<template>
    <div class="flex flex-wrap gap-3">
        <VCPopover
            v-for="side in ['top', 'right', 'bottom', 'left'] as const"
            :key="side"
        >
            <VCPopoverTrigger
                class="inline-flex items-center justify-center rounded-md border border-border
                    bg-bg px-3 py-1.5 text-sm font-medium hover:bg-bg-muted"
            >
                {{ side }}
            </VCPopoverTrigger>
            <VCPopoverContent
                :side="side"
                :side-offset="8"
            >
                <div class="flex flex-col gap-1">
                    <p class="text-sm font-semibold">
                        {{ side }} popover
                    </p>
                    <p class="text-xs text-fg-muted">
                        Anchored to the trigger; floating-ui flips and shifts so it stays on-screen.
                    </p>
                </div>
                <VCPopoverArrow />
                <VCPopoverClose />
            </VCPopoverContent>
        </VCPopover>
    </div>
</template>
