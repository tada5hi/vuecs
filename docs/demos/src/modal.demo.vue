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

const open = ref(false);
</script>

<template>
    <VCModal v-model:open="open">
        <VCModalTrigger
            class="inline-flex items-center justify-center rounded-md bg-primary-600
                px-3 py-1.5 text-sm font-medium text-on-primary hover:bg-primary-700"
        >
            Open dialog
        </VCModalTrigger>
        <VCModalContent>
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
            <div class="flex justify-end gap-2">
                <button
                    type="button"
                    class="rounded-md border border-border bg-bg px-3 py-1.5 text-sm font-medium hover:bg-bg-muted"
                    @click="open = false"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="rounded-md bg-error-600 px-3 py-1.5 text-sm font-medium text-on-error hover:bg-error-700"
                    @click="open = false"
                >
                    Confirm
                </button>
            </div>
        </VCModalContent>
    </VCModal>
</template>
