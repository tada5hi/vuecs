<script setup lang="ts">
import { VCVisuallyHidden } from '@vuecs/elements';
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <button type="button">
            <span aria-hidden="true">×</span>
            <VCVisuallyHidden>Close dialog</VCVisuallyHidden>
        </button>
        <p style="font-size: 0.875rem; color: var(--vc-color-fg-muted); margin: 0;">
            Inspect the button above — the "Close dialog" label is visually clipped
            but still announced by screen readers.
        </p>
    </div>
</template>
