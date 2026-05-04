<script setup lang="ts">
import { VCAvatar } from '@vuecs/elements';
import { variantState } from './iframe-bridge';
</script>

<template>
    <div style="display: flex; gap: 1rem; align-items: center;">
        <VCAvatar
            src="https://i.pravatar.cc/80?img=15"
            alt="Avatar 1"
            :theme-variant="variantState"
        />
        <VCAvatar
            src="/missing-avatar.jpg"
            alt="Broken image — fallback wins"
            :theme-variant="variantState"
        >
            <template #fallback>
                AB
            </template>
        </VCAvatar>
        <VCAvatar :theme-variant="variantState">
            <template #fallback>
                ?
            </template>
        </VCAvatar>
    </div>
</template>
