<script setup lang="ts">
import {
    VCPlaceholder,
    VCPlaceholderCard,
    VCPlaceholderTable,
    VCPlaceholderWrapper,
} from '@vuecs/placeholder';
import type { PlaceholderAnimation, PlaceholderSize } from '@vuecs/placeholder';
import { ref } from 'vue';

withDefaults(defineProps<{
    animation?: PlaceholderAnimation;
    size?: PlaceholderSize;
    rows?: number;
    columns?: number;
}>(), {
    animation: 'wave',
    size: 'md',
    rows: 5,
    columns: 4,
});

const loading = ref(true);
function toggleLoading() { loading.value = !loading.value; }
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Single bar -->
        <div>
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                single bar — `:width` (string or number) + `:size` + `:animation`
            </span>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.25rem;">
                <VCPlaceholder
                    :animation="animation"
                    :size="size"
                    width="100%"
                />
                <VCPlaceholder
                    :animation="animation"
                    :size="size"
                    width="80%"
                />
                <VCPlaceholder
                    :animation="animation"
                    :size="size"
                    width="60%"
                />
                <VCPlaceholder
                    :animation="animation"
                    :size="size"
                    :width="40"
                />
            </div>
        </div>

        <!-- Table skeleton -->
        <div style="padding-top: 0.5rem; border-top: 1px dashed var(--vc-color-border);">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                `&lt;VCPlaceholderTable&gt;` — table-shaped skeleton with header
            </span>
            <VCPlaceholderTable
                :rows="rows"
                :columns="columns"
                :animation="animation"
                show-header
            />
        </div>

        <!-- Card skeleton -->
        <div style="padding-top: 0.5rem; border-top: 1px dashed var(--vc-color-border);">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                `&lt;VCPlaceholderCard&gt;` — image + header + body + footer
            </span>
            <VCPlaceholderCard
                :animation="animation"
                style="max-width: 420px;"
            />
        </div>

        <!-- Wrapper — conditional skeleton vs real content -->
        <div style="padding-top: 0.5rem; border-top: 1px dashed var(--vc-color-border);">
            <span style="font-size: 0.75rem; color: var(--vc-color-fg-muted);">
                `&lt;VCPlaceholderWrapper&gt;` — flips between `#loading` skeleton + `#default` content
            </span>
            <div style="margin-top: 0.5rem;">
                <label style="display: inline-flex; gap: 0.5rem; align-items: center; font-size: 0.75rem;">
                    <input
                        :checked="loading"
                        type="checkbox"
                        @change="toggleLoading"
                    >
                    <span>Toggle loading</span>
                </label>
            </div>
            <VCPlaceholderWrapper
                :loading="loading"
                style="margin-top: 0.75rem;"
            >
                <template #loading>
                    <VCPlaceholderTable
                        :rows="3"
                        :columns="columns"
                        :animation="animation"
                    />
                </template>
                <template #default>
                    <div style="padding: 1rem; background: var(--vc-color-bg-muted); border-radius: 0.5rem;">
                        Real content rendered. Toggle the checkbox to flip back to the skeleton.
                    </div>
                </template>
            </VCPlaceholderWrapper>
        </div>
    </div>
</template>
