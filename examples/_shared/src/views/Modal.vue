<script setup lang="ts">
import {
    VCModal,
    VCModalClose,
    VCModalContent,
    VCModalDescription,
    VCModalTitle,
    VCModalTrigger,
} from '@vuecs/overlays';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const open = ref(false);
</script>

<template>
    <VCModal v-model:open="open">
        <VCModalTrigger class="vc-demo-trigger">
            Open dialog
        </VCModalTrigger>
        <VCModalContent :theme-variant="themeVariant">
            <!--
              <VCModalClose /> with no children renders the default × in the
              top-right corner — that's the position the theme-tailwind
              `close` slot styles for. Use plain <button @click="open = false">
              for buttons elsewhere in the dialog.
            -->
            <VCModalClose />
            <VCModalTitle>Confirm action</VCModalTitle>
            <VCModalDescription>
                This will permanently delete the record. This action can't be undone.
            </VCModalDescription>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                <button
                    type="button"
                    class="vc-demo-btn-cancel"
                    @click="open = false"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="vc-demo-btn-danger"
                    @click="open = false"
                >
                    Confirm
                </button>
            </div>
        </VCModalContent>
    </VCModal>
</template>

<style scoped>
.vc-demo-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 0.375rem;
    background-color: var(--vc-color-primary-600);
    color: var(--vc-color-on-primary, #fff);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
}
.vc-demo-trigger:hover {
    background-color: var(--vc-color-primary-700);
}
.vc-demo-btn-cancel {
    border-radius: 0.375rem;
    border: 1px solid var(--vc-color-border);
    background-color: var(--vc-color-bg);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
}
.vc-demo-btn-cancel:hover {
    background-color: var(--vc-color-bg-muted);
}
.vc-demo-btn-danger {
    border: 0;
    border-radius: 0.375rem;
    background-color: var(--vc-color-error-600);
    color: var(--vc-color-on-error, #fff);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
}
.vc-demo-btn-danger:hover {
    background-color: var(--vc-color-error-700);
}
</style>
