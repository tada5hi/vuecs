<script setup lang="ts">
import { VCSeparator } from '@vuecs/elements';
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
        <p style="margin: 0;">
            First section
        </p>
        <VCSeparator />
        <p style="margin: 0;">
            Second section
        </p>
        <VCSeparator />
        <p style="margin: 0;">
            Third section
        </p>
        <div style="display: flex; align-items: center; gap: 0.75rem; height: 2rem;">
            <span>Left</span>
            <VCSeparator orientation="vertical" />
            <span>Middle</span>
            <VCSeparator orientation="vertical" />
            <span>Right</span>
        </div>
    </div>
</template>
