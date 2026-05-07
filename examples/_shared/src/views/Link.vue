<script setup lang="ts">
import { VCLink } from '@vuecs/link';
</script>

<template>
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center;">
        <!-- External link — renders <a target="_blank"> -->
        <VCLink
            href="https://github.com/tada5hi/vuecs"
            target="_blank"
        >
            External (GitHub)
        </VCLink>

        <!--
          Internal: in a real app with vue-router or Nuxt you'd use
          `:to="/some/route"` and VCLink would render
          <RouterLink>/<NuxtLink>. The docs site has no vue-router so
          we use href here for the demo to be navigable.
        -->
        <VCLink href="/components/">
            Internal
        </VCLink>

        <!-- Disabled — adds `disabled` class and blocks click events -->
        <VCLink
            href="https://example.com"
            :disabled="true"
        >
            Disabled
        </VCLink>
    </div>
</template>
