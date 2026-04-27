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

const lastAction = ref<string>('—');
</script>

<template>
    <div class="flex flex-col items-start gap-3">
        <VCDropdownMenu>
            <VCDropdownMenuTrigger
                class="inline-flex items-center justify-center rounded-md border border-border
                    bg-bg px-3 py-1.5 text-sm font-medium hover:bg-bg-muted"
            >
                Actions ▾
            </VCDropdownMenuTrigger>
            <VCDropdownMenuContent>
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
        <p class="text-xs text-fg-muted">
            Last action: <span class="font-mono">{{ lastAction }}</span>
        </p>
    </div>
</template>
