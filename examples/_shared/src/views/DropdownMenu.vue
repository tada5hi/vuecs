<script setup lang="ts">
import {
    VCDropdownMenu,
    VCDropdownMenuContent,
    VCDropdownMenuGroup,
    VCDropdownMenuItem,
    VCDropdownMenuLabel,
    VCDropdownMenuSeparator,
    VCDropdownMenuTrigger,
} from '@vuecs/overlays';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const lastAction = ref<string>('—');
</script>

<template>
    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem;">
        <VCDropdownMenu>
            <VCDropdownMenuTrigger class="vc-demo-button">
                Actions ▾
            </VCDropdownMenuTrigger>
            <VCDropdownMenuContent :theme-variant="themeVariant">
                <VCDropdownMenuLabel>Manage</VCDropdownMenuLabel>
                <VCDropdownMenuGroup>
                    <VCDropdownMenuItem @select="lastAction = 'edit'">
                        Edit
                    </VCDropdownMenuItem>
                    <VCDropdownMenuItem @select="lastAction = 'duplicate'">
                        Duplicate
                    </VCDropdownMenuItem>
                    <VCDropdownMenuItem @select="lastAction = 'share'">
                        Share
                    </VCDropdownMenuItem>
                </VCDropdownMenuGroup>
                <VCDropdownMenuSeparator />
                <VCDropdownMenuItem @select="lastAction = 'archive'">
                    Archive
                </VCDropdownMenuItem>
                <VCDropdownMenuItem @select="lastAction = 'delete'">
                    Delete
                </VCDropdownMenuItem>
            </VCDropdownMenuContent>
        </VCDropdownMenu>
        <p style="font-size: 0.75rem; color: var(--vc-color-fg-muted); margin: 0;">
            Last action: <span style="font-family: ui-monospace, monospace;">{{ lastAction }}</span>
        </p>
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
