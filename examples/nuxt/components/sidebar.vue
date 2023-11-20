<!--
  - Copyright (c) 2021-2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->
<script lang="ts">
import { VCNavItems } from '@vue-layout/navigation';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: { VLNavItems: VCNavItems },
});
</script>
<template>
    <div class="page-sidebar">
        <VLNavItems
            class="sidebar-menu navbar-nav"
            :tier="1"
        />
    </div>
</template>
