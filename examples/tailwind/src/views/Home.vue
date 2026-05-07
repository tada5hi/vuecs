<script setup lang="ts">
import { sharedRoutes } from '@vuecs-examples/shared/routes';
</script>

<template>
    <div class="space-y-4">
        <h1 class="text-2xl font-semibold">
            vuecs · <span class="text-primary-600">Tailwind</span> example
        </h1>
        <p class="text-fg-muted">
            Vanilla Vite + Vue 3 with <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">@vuecs/theme-tailwind</code>.
            Pick a component from the sidebar — every demo is rendered from the shared
            <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">@vuecs-examples/shared</code>
            workspace package; swap the theme entry in <code class="rounded bg-bg-muted px-1.5 py-0.5 text-sm">main.ts</code>
            and the same views render under Bootstrap or Bulma.
        </p>
        <p class="text-fg-muted text-sm">
            {{ sharedRoutes.length }} shared component demos available.
        </p>
    </div>
</template>
