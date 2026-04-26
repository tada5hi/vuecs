<script setup lang="ts">
import { VCButton } from '@vuecs/button';
import { useSubmitButton } from '@vuecs/form-controls';
import { ref } from 'vue';

const isEditing = ref(false);
const submit = useSubmitButton({ isEditing: () => isEditing.value });
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCButton color="primary" label="Primary" />
            <VCButton color="success" label="Success" />
            <VCButton color="warning" label="Warning" />
            <VCButton color="error" label="Danger" />
            <VCButton color="neutral" label="Neutral" />
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCButton variant="solid" label="Solid" />
            <VCButton variant="soft" label="Soft" />
            <VCButton variant="outline" label="Outline" />
            <VCButton variant="ghost" label="Ghost" />
            <VCButton variant="link" label="Link" />
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCButton size="sm" label="Small" />
            <VCButton size="md" label="Medium" />
            <VCButton size="lg" label="Large" />
            <VCButton :loading="true" label="Loading…" />
            <VCButton :disabled="true" label="Disabled" />
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <!--
              useSubmitButton() returns a reactive bind-object — label /
              icon / color all swap when `isEditing` flips. Demonstrates
              the i18n-friendly DefaultsManager hook in a real bind site.
            -->
            <button
                type="button"
                style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--vc-color-border); border-radius: 0.25rem;"
                @click="isEditing = !isEditing"
            >
                Toggle isEditing ({{ isEditing ? 'on' : 'off' }})
            </button>
            <VCButton v-bind="submit" />
        </div>
    </div>
</template>
