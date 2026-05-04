<script setup lang="ts">
import { VCGravatar } from '@vuecs/gravatar';
</script>

<template>
    <div style="display: flex; gap: 1rem; align-items: center;">
        <VCGravatar
            email="contact@tada5hi.net"
            display-size="md"
            :size="80"
        />
        <VCGravatar
            email="hello@example.com"
            display-size="md"
            :size="80"
        />
        <VCGravatar
            email="anon@example.com"
            display-size="md"
            :size="80"
        />
    </div>
</template>
