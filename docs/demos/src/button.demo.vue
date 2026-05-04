<script setup lang="ts">
import { VCButton } from '@vuecs/button';
import { useSubmitButton } from '@vuecs/forms';
import { ref } from 'vue';
import { variantState } from './iframe-bridge';

const isEditing = ref(false);
const submit = useSubmitButton({ isEditing: () => isEditing.value });
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Color axis. The toolbar's `size` value is forwarded via
             `:theme-variant`, so flipping it reskins this row (and every
             other row except the explicit size grid below). -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCButton color="primary" label="Primary" :theme-variant="variantState" />
            <VCButton color="success" label="Success" :theme-variant="variantState" />
            <VCButton color="warning" label="Warning" :theme-variant="variantState" />
            <VCButton color="error" label="Danger" :theme-variant="variantState" />
            <VCButton color="neutral" label="Neutral" :theme-variant="variantState" />
        </div>

        <!-- Variant axis. -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCButton variant="solid" label="Solid" :theme-variant="variantState" />
            <VCButton variant="soft" label="Soft" :theme-variant="variantState" />
            <VCButton variant="outline" label="Outline" :theme-variant="variantState" />
            <VCButton variant="ghost" label="Ghost" :theme-variant="variantState" />
            <VCButton variant="link" label="Link" :theme-variant="variantState" />
        </div>

        <!-- Explicit size grid — these buttons keep their `size` prop so
             they remain a stable reference; the explicit prop wins over
             themeVariant.size at the component's merge step. -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCButton size="sm" label="Small" />
            <VCButton size="md" label="Medium" />
            <VCButton size="lg" label="Large" />
            <VCButton :loading="true" label="Loading…" :theme-variant="variantState" />
            <VCButton :disabled="true" label="Disabled" :theme-variant="variantState" />
        </div>

        <!-- useSubmitButton() returns a reactive bind-object — label /
             icon / color all swap when `isEditing` flips. -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <button
                type="button"
                style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border: 1px solid var(--vc-color-border); border-radius: 0.25rem;"
                @click="isEditing = !isEditing"
            >
                Toggle isEditing ({{ isEditing ? 'on' : 'off' }})
            </button>
            <VCButton
                v-bind="submit"
                :theme-variant="variantState"
            />
        </div>
    </div>
</template>
