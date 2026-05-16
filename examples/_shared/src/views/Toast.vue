<script setup lang="ts">
import {
    VCToastProvider,
    VCToaster,
    useToast,
} from '@vuecs/overlays';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const toast = useToast();

function showSuccess() {
    toast.add({
        title: 'Saved',
        description: 'Your changes were saved successfully.',
        color: 'success',
    });
}

function showError() {
    toast.add({
        title: 'Upload failed',
        description: 'Network error — please retry.',
        color: 'error',
        duration: 8000,
    });
}

function showInfo() {
    toast.add({
        title: 'Background sync started',
        description: 'We\'ll let you know when it\'s done.',
        color: 'info',
        variant: 'soft',
    });
}

function showWithAction() {
    const id = toast.add({
        title: 'Item moved to trash',
        description: 'You can still restore it for a few seconds.',
        color: 'neutral',
        duration: 10000,
        action: {
            label: 'Undo',
            onClick: () => {
                toast.dismiss(id);
                toast.add({
                    title: 'Restored',
                    color: 'success',
                });
            },
        },
    });
}

function showPersistent() {
    toast.add({
        title: 'New feature available',
        description: 'This stays until dismissed.',
        color: 'primary',
        duration: Infinity,
    });
}

function clearAll() {
    toast.clear();
}
</script>

<template>
    <VCToastProvider :duration="5000">
        <div class="vc-demo-toast-grid">
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-success"
                @click="showSuccess"
            >
                Show success
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-error"
                @click="showError"
            >
                Show error
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-info"
                @click="showInfo"
            >
                Show info (soft)
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-neutral"
                @click="showWithAction"
            >
                Show with undo action
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-primary"
                @click="showPersistent"
            >
                Show persistent
            </button>
            <button
                type="button"
                class="vc-demo-toast-btn vc-demo-toast-btn-clear"
                @click="clearAll"
            >
                Clear all
            </button>
        </div>
        <VCToaster
            position="top-right"
            :theme-variant="themeVariant"
        />
    </VCToastProvider>
</template>

<style scoped>
.vc-demo-toast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.5rem;
    max-width: 36rem;
}
.vc-demo-toast-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    color: #fff;
}
.vc-demo-toast-btn-success { background-color: var(--vc-color-success-600); }
.vc-demo-toast-btn-success:hover { background-color: var(--vc-color-success-700); }
.vc-demo-toast-btn-error { background-color: var(--vc-color-error-600); }
.vc-demo-toast-btn-error:hover { background-color: var(--vc-color-error-700); }
.vc-demo-toast-btn-info { background-color: var(--vc-color-info-600); }
.vc-demo-toast-btn-info:hover { background-color: var(--vc-color-info-700); }
.vc-demo-toast-btn-neutral {
    background-color: var(--vc-color-bg-muted);
    color: var(--vc-color-fg);
    border: 1px solid var(--vc-color-border);
}
.vc-demo-toast-btn-neutral:hover { background-color: var(--vc-color-bg); }
.vc-demo-toast-btn-primary { background-color: var(--vc-color-primary-600); }
.vc-demo-toast-btn-primary:hover { background-color: var(--vc-color-primary-700); }
.vc-demo-toast-btn-clear {
    background-color: transparent;
    color: var(--vc-color-fg-muted);
    border: 1px solid var(--vc-color-border);
}
.vc-demo-toast-btn-clear:hover {
    background-color: var(--vc-color-bg-muted);
    color: var(--vc-color-fg);
}
</style>
