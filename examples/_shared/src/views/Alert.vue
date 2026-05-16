<script setup lang="ts">
import {
    VCAlert,
    VCAlertClose,
    VCAlertDescription,
    VCAlertTitle,
    VCCollapse,
    VCCollapseContent,
} from '@vuecs/elements';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const dismissibleOpen = ref(true);
const collapseOpen = ref(true);

function reset() {
    dismissibleOpen.value = true;
    collapseOpen.value = true;
}
</script>

<template>
    <div class="vc-demo-stack">
        <section>
            <h3 class="vc-demo-h">
                Inline shorthand
            </h3>
            <VCAlert
                color="info"
                :theme-variant="themeVariant"
            >
                All systems operational.
            </VCAlert>
        </section>

        <section>
            <h3 class="vc-demo-h">
                Title + description compound
            </h3>
            <VCAlert
                color="warning"
                :theme-variant="themeVariant"
            >
                <VCAlertTitle>Network unstable</VCAlertTitle>
                <VCAlertDescription>
                    Your changes will be saved as soon as the connection
                    recovers. No action required.
                </VCAlertDescription>
            </VCAlert>
        </section>

        <section>
            <h3 class="vc-demo-h">
                Severity matrix
            </h3>
            <div class="vc-demo-grid">
                <VCAlert color="success">
                    Saved successfully.
                </VCAlert>
                <VCAlert color="info">
                    Background sync started.
                </VCAlert>
                <VCAlert color="warning">
                    Disk usage at 87%.
                </VCAlert>
                <VCAlert color="error">
                    Submission failed.
                </VCAlert>
            </div>
        </section>

        <section>
            <h3 class="vc-demo-h">
                Dismissible (with corner-X)
            </h3>
            <VCAlert
                v-if="dismissibleOpen"
                color="error"
                :theme-variant="themeVariant"
            >
                <VCAlertTitle>Cannot save while policy is locked</VCAlertTitle>
                <VCAlertDescription>
                    Unlock the policy in the admin console to retry.
                </VCAlertDescription>
                <VCAlertClose @click="dismissibleOpen = false" />
            </VCAlert>
            <button
                v-if="!dismissibleOpen"
                type="button"
                class="vc-demo-btn"
                @click="reset"
            >
                Restore alerts
            </button>
        </section>

        <section>
            <h3 class="vc-demo-h">
                Dismiss-with-collapse animation (plan 031 Q4 composition)
            </h3>
            <VCCollapse v-model:open="collapseOpen">
                <VCCollapseContent>
                    <VCAlert
                        color="success"
                        :theme-variant="themeVariant"
                    >
                        <VCAlertTitle>Profile updated</VCAlertTitle>
                        <VCAlertDescription>Click the × to collapse smoothly.</VCAlertDescription>
                        <VCAlertClose @click="collapseOpen = false" />
                    </VCAlert>
                </VCCollapseContent>
            </VCCollapse>
        </section>
    </div>
</template>

<style scoped>
.vc-demo-stack {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 36rem;
}
.vc-demo-h {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: var(--vc-color-fg-muted);
}
.vc-demo-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.vc-demo-btn {
    margin-top: 0.5rem;
    border: 1px solid var(--vc-color-border);
    background: var(--vc-color-bg-muted);
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    cursor: pointer;
}
</style>
