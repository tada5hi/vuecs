<script setup lang="ts">
import { sharedRoutes } from '@vuecs-examples/shared/routes';
</script>

<template>
    <div>
        <h1 class="h3 mb-3">
            vuecs · <span class="text-primary">Bootstrap</span> example
        </h1>
        <p class="text-secondary">
            Vanilla Vite + Vue 3 with <code>@vuecs/theme-bootstrap</code>. No Tailwind in this app.
            Pick a component from the sidebar — every demo is rendered from the shared
            <code>@vuecs-examples/shared</code> workspace package; the same views also
            render under Tailwind and Bulma in their respective example apps.
        </p>
        <p class="text-secondary small">
            {{ sharedRoutes.length }} shared component demos available.
        </p>
    </div>
</template>
