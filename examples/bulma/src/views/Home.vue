<script setup lang="ts">
import { sharedRoutes } from '@vuecs-examples/shared/routes';
</script>

<template>
    <div>
        <h1 class="title is-4 mb-3">
            vuecs · <span class="has-text-primary">Bulma</span> example
        </h1>
        <p class="has-text-grey-dark">
            Vanilla Vite + Vue 3 with <code>@vuecs/theme-bulma</code>. No Tailwind in this app.
            Pick a component from the sidebar — every demo is rendered from the shared
            <code>@vuecs-examples/shared</code> workspace package; the same views also
            render under Tailwind and Bootstrap in their respective example apps.
        </p>
        <p class="has-text-grey is-size-7">
            {{ sharedRoutes.length }} shared component demos available.
        </p>
    </div>
</template>
