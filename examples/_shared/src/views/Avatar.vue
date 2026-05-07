<script setup lang="ts">
import { VCAvatar } from '@vuecs/elements';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();
</script>

<template>
    <div style="display: flex; gap: 1rem; align-items: center;">
        <VCAvatar
            src="https://i.pravatar.cc/80?img=15"
            alt="Avatar 1"
            :theme-variant="themeVariant"
        />
        <VCAvatar
            src="/missing-avatar.jpg"
            alt="Broken image — fallback wins"
            :theme-variant="themeVariant"
        >
            <template #fallback>
                AB
            </template>
        </VCAvatar>
        <VCAvatar :theme-variant="themeVariant">
            <template #fallback>
                ?
            </template>
        </VCAvatar>
    </div>
</template>
