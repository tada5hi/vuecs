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

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const lastAction = ref<string>('—');
</script>

<template>
    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem;">
        <VCContextMenu>
            <VCContextMenuTrigger>
                <div
                    style="display: flex; height: 8rem; width: 18rem; align-items: center;
                        justify-content: center; border-radius: 0.375rem; border: 2px dashed var(--vc-color-border);
                        background-color: var(--vc-color-bg-muted); font-size: 0.875rem;
                        color: var(--vc-color-fg-muted); user-select: none;"
                >
                    Right-click anywhere in this box
                </div>
            </VCContextMenuTrigger>
            <VCContextMenuContent :theme-variant="themeVariant">
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
        <p style="font-size: 0.75rem; color: var(--vc-color-fg-muted); margin: 0;">
            Last action: <span style="font-family: ui-monospace, monospace;">{{ lastAction }}</span>
        </p>
    </div>
</template>
