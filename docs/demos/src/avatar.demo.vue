<script setup lang="ts">
import { VCAvatar } from '@vuecs/elements';
</script>

<template>
    <div style="display: flex; gap: 1rem; align-items: center;">
        <VCAvatar
            src="https://i.pravatar.cc/80?img=15"
            alt="Avatar 1"
        />
        <VCAvatar
            src="/missing-avatar.jpg"
            alt="Broken image — fallback wins"
        >
            <template #fallback>
                AB
            </template>
        </VCAvatar>
        <VCAvatar>
            <template #fallback>
                ?
            </template>
        </VCAvatar>
    </div>
</template>
