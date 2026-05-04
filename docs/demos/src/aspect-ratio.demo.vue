<script setup lang="ts">
import { VCAspectRatio } from '@vuecs/elements';
</script>

<template>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 32rem;">
        <div>
            <p style="font-size: 0.75rem; color: var(--vc-color-fg-muted); margin: 0 0 0.25rem 0;">
                16 / 9
            </p>
            <VCAspectRatio :ratio="16 / 9">
                <img
                    src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=400&dpr=2&q=80"
                    alt="Landscape sample"
                    style="border-radius: 0.5rem; object-fit: cover;"
                >
            </VCAspectRatio>
        </div>
        <div>
            <p style="font-size: 0.75rem; color: var(--vc-color-fg-muted); margin: 0 0 0.25rem 0;">
                1 / 1
            </p>
            <VCAspectRatio :ratio="1">
                <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&dpr=2&q=80"
                    alt="Square sample"
                    style="border-radius: 0.5rem; object-fit: cover;"
                >
            </VCAspectRatio>
        </div>
    </div>
</template>
