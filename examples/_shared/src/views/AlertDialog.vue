<script setup lang="ts">
import {
    VCAlertDialog,
    VCAlertDialogAction,
    VCAlertDialogCancel,
    VCAlertDialogContent,
    VCAlertDialogDescription,
    VCAlertDialogProvider,
    VCAlertDialogTitle,
    VCAlertDialogTrigger,
    useAlertDialog,
} from '@vuecs/overlays';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

// Imperative API — a single <VCAlertDialogProvider> host (mounted below) drains
// the shared queue this resolves against.
const confirm = useAlertDialog();
const lastResult = ref<string>();

async function runConfirm() {
    const ok = await confirm({
        title: 'Delete project?',
        description: 'This permanently removes the project and all of its data.',
        confirmLabel: 'Delete',
        cancelLabel: 'Keep',
        tone: 'error',
    });
    lastResult.value = ok ?
        'Confirmed — the project would be deleted.' :
        'Cancelled — nothing happened.';
}
</script>

<template>
    <div class="vc-demo-stack">
        <!-- Declarative compound -->
        <section class="vc-demo-section">
            <h3 class="vc-demo-heading">
                Declarative
            </h3>
            <VCAlertDialog>
                <VCAlertDialogTrigger class="vc-demo-btn-danger">
                    Delete…
                </VCAlertDialogTrigger>
                <VCAlertDialogContent :theme-variant="themeVariant">
                    <VCAlertDialogTitle>Delete project?</VCAlertDialogTitle>
                    <VCAlertDialogDescription>
                        This permanently removes the project and all of its data.
                    </VCAlertDialogDescription>
                    <div class="vc-demo-footer">
                        <VCAlertDialogCancel>Cancel</VCAlertDialogCancel>
                        <VCAlertDialogAction :theme-variant="{ tone: 'error' }">
                            Delete
                        </VCAlertDialogAction>
                    </div>
                </VCAlertDialogContent>
            </VCAlertDialog>
        </section>

        <!-- Imperative API -->
        <section class="vc-demo-section">
            <h3 class="vc-demo-heading">
                Imperative — <code>useAlertDialog()</code>
            </h3>
            <button
                type="button"
                class="vc-demo-btn-danger"
                @click="runConfirm"
            >
                Delete via useAlertDialog…
            </button>
            <p
                v-if="lastResult"
                class="vc-demo-result"
            >
                {{ lastResult }}
            </p>
        </section>

        <!-- Single host for the imperative useAlertDialog() queue. -->
        <VCAlertDialogProvider />
    </div>
</template>

<style scoped>
.vc-demo-stack {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
.vc-demo-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
}
.vc-demo-heading {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--vc-color-fg-muted, #6b7280);
}
.vc-demo-btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
.vc-demo-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}
.vc-demo-result {
    margin: 0;
    font-size: 0.875rem;
    color: var(--vc-color-fg, #111827);
}
</style>
