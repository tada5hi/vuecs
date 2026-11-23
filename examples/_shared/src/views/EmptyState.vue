<script setup lang="ts">
import { VCEmptyState } from '@vuecs/elements';
import type { EmptyStateVariant } from '@vuecs/elements';
import { ref } from 'vue';

const props = withDefaults(defineProps<{
    variant?: EmptyStateVariant;
}>(), { variant: 'empty' });

const actions = ref(0);
</script>

<template>
    <div class="vc-demo-stack">
        <section>
            <h3 class="vc-demo-h">
                Empty collection
            </h3>
            <VCEmptyState
                v-if="props.variant === 'empty'"
                icon="lucide:inbox"
                title="No users yet"
                description="Users you create will show up here."
                action-label="Create user"
                @action="actions++"
            />
            <VCEmptyState
                v-else
                variant="noResults"
                icon="lucide:search-x"
                @action="actions++"
            />
            <p class="vc-demo-note">
                action emitted {{ actions }}×
            </p>
        </section>

        <section>
            <h3 class="vc-demo-h">
                No results (default copy)
            </h3>
            <VCEmptyState
                variant="noResults"
                @action="actions++"
            />
        </section>

        <section>
            <h3 class="vc-demo-h">
                Custom action slot
            </h3>
            <VCEmptyState
                title="No projects"
                description="Projects group your documents."
                @action="actions++"
            >
                <template #action="{ class: actionClass, action }">
                    <a
                        :class="actionClass"
                        href="#create"
                        @click.prevent="action"
                    >Start a project</a>
                </template>
            </VCEmptyState>
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
.vc-demo-note {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--vc-color-fg-muted);
}
</style>
