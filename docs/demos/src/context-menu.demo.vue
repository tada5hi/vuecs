<script setup lang="ts">
import {
    VCContextMenu,
    VCContextMenuContent,
    VCContextMenuItem,
    VCContextMenuLabel,
    VCContextMenuSeparator,
    VCContextMenuTrigger,
} from '@vuecs/overlays';
import { ref } from 'vue';

const lastAction = ref<string>('—');
</script>

<template>
    <div class="flex flex-col items-start gap-3">
        <VCContextMenu>
            <VCContextMenuTrigger>
                <div
                    class="flex h-32 w-72 items-center justify-center rounded-md border-2 border-dashed
                        border-border bg-bg-muted text-sm text-fg-muted select-none"
                >
                    Right-click anywhere in this box
                </div>
            </VCContextMenuTrigger>
            <VCContextMenuContent>
                <VCContextMenuLabel>Item options</VCContextMenuLabel>
                <VCContextMenuItem @select="lastAction = 'open'">
                    Open
                </VCContextMenuItem>
                <VCContextMenuItem @select="lastAction = 'rename'">
                    Rename
                </VCContextMenuItem>
                <VCContextMenuItem @select="lastAction = 'duplicate'">
                    Duplicate
                </VCContextMenuItem>
                <VCContextMenuSeparator />
                <VCContextMenuItem @select="lastAction = 'delete'">
                    Delete
                </VCContextMenuItem>
            </VCContextMenuContent>
        </VCContextMenu>
        <p class="text-xs text-fg-muted">
            Last action: <span class="font-mono">{{ lastAction }}</span>
        </p>
    </div>
</template>
