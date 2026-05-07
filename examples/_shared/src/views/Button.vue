<script setup lang="ts">
import { VCButton } from '@vuecs/button';
import { useSubmitButton } from '@vuecs/forms';
import { ref } from 'vue';

defineProps<{
    /**
     * Theme-variant overrides forwarded to every button. When the docs
     * iframe is the host, this is the reactive `variantState` from
     * `iframe-bridge.ts`; in the example apps, no value is passed and
     * the default empty object means each button uses its own
     * `:size` / `:variant` props.
     */
    themeVariant?: Record<string, string | boolean>;
}>();

const isEditing = ref(false);
const submit = useSubmitButton({ isEditing: () => isEditing.value });
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Color axis. The toolbar's `size` value is forwarded via
             `:theme-variant`, so flipping it reskins this row (and every
             other row except the explicit size grid below). -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCButton
                color="primary"
                label="Primary"
                :theme-variant="themeVariant"
            />
            <VCButton
                color="success"
                label="Success"
                :theme-variant="themeVariant"
            />
            <VCButton
                color="warning"
                label="Warning"
                :theme-variant="themeVariant"
            />
            <VCButton
                color="error"
                label="Danger"
                :theme-variant="themeVariant"
            />
            <VCButton
                color="neutral"
                label="Neutral"
                :theme-variant="themeVariant"
            />
        </div>

        <!-- Variant axis. -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCButton
                variant="solid"
                label="Solid"
                :theme-variant="themeVariant"
            />
            <VCButton
                variant="soft"
                label="Soft"
                :theme-variant="themeVariant"
            />
            <VCButton
                variant="outline"
                label="Outline"
                :theme-variant="themeVariant"
            />
            <VCButton
                variant="ghost"
                label="Ghost"
                :theme-variant="themeVariant"
            />
            <VCButton
                variant="link"
                label="Link"
                :theme-variant="themeVariant"
            />
        </div>

        <!-- Explicit size grid — these buttons keep their `size` prop so
             they remain a stable reference; the explicit prop wins over
             themeVariant.size at the component's merge step. -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <VCButton
                size="sm"
                label="Small"
            />
            <VCButton
                size="md"
                label="Medium"
            />
            <VCButton
                size="lg"
                label="Large"
            />
            <VCButton
                :loading="true"
                label="Loading…"
                :theme-variant="themeVariant"
            />
            <VCButton
                :disabled="true"
                label="Disabled"
                :theme-variant="themeVariant"
            />
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
                :theme-variant="themeVariant"
            />
        </div>
    </div>
</template>
