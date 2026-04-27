<script setup lang="ts">
import {
    VCTooltip,
    VCTooltipArrow,
    VCTooltipContent,
    VCTooltipProvider,
    VCTooltipTrigger,
} from '@vuecs/overlays';
</script>

<template>
    <VCTooltipProvider :delay-duration="200">
        <div class="flex flex-wrap gap-3">
            <VCTooltip
                v-for="side in ['top', 'right', 'bottom', 'left'] as const"
                :key="side"
            >
                <VCTooltipTrigger
                    class="inline-flex items-center justify-center rounded-md border border-border
                        bg-bg px-3 py-1.5 text-sm font-medium hover:bg-bg-muted"
                >
                    Hover ({{ side }})
                </VCTooltipTrigger>
                <VCTooltipContent
                    :side="side"
                    :side-offset="6"
                >
                    Tooltip on the {{ side }}
                    <VCTooltipArrow />
                </VCTooltipContent>
            </VCTooltip>
        </div>
    </VCTooltipProvider>
</template>
