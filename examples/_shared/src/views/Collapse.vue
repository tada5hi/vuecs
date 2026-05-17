<script setup lang="ts">
import {
    VCCollapse,
    VCCollapseContent,
    VCCollapseTrigger,
} from '@vuecs/elements';
import { ref } from 'vue';

defineProps<{
    themeVariant?: Record<string, string | boolean>;
}>();

const open = ref(false);
const sectionOpen = ref(true);
</script>

<template>
    <div class="vc-demo-stack">
        <section>
            <h3 class="vc-demo-h">
                Simple toggle
            </h3>
            <VCCollapse
                v-model:open="open"
                :theme-variant="themeVariant"
            >
                <VCCollapseTrigger>
                    {{ open ? 'Hide details' : 'Show details' }}
                </VCCollapseTrigger>
                <VCCollapseContent>
                    <p class="vc-demo-pane">
                        Reka's Collapsible primitive handles the height
                        transition + a11y wiring (`aria-expanded` /
                        `aria-controls`). The chevron rotates automatically
                        via the `[data-state="open"] .vc-collapse-chevron`
                        structural rule.
                    </p>
                </VCCollapseContent>
            </VCCollapse>
        </section>

        <section>
            <h3 class="vc-demo-h">
                Pre-expanded with chevron hidden
            </h3>
            <VCCollapse :default-open="sectionOpen">
                <VCCollapseTrigger :theme-variant="{ chevron: 'none' }">
                    No-chevron trigger
                </VCCollapseTrigger>
                <VCCollapseContent>
                    <p class="vc-demo-pane">
                        `chevron: 'none'` hides the auto-rendered icon for
                        custom triggers (e.g. icon-only buttons, card
                        headers that don't want a duplicate chevron).
                    </p>
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
.vc-demo-pane {
    margin: 0.5rem 0 0;
    padding: 0.75rem;
    border: 1px solid var(--vc-color-border);
    border-radius: 0.375rem;
    background: var(--vc-color-bg-muted);
    font-size: 0.875rem;
}
</style>
