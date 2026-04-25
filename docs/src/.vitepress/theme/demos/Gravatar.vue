<script setup lang="ts">
import { VCGravatar } from '@vuecs/gravatar';
</script>

<template>
    <div style="display: flex; gap: 1rem; align-items: center;">
        <VCGravatar
            email="contact@tada5hi.net"
            :size="48"
        />
        <VCGravatar
            email="hello@example.com"
            :size="48"
        />
        <VCGravatar
            email="anon@example.com"
            :size="48"
        />
    </div>
</template>
