<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import PaletteSwitch from './components/PaletteSwitch.vue';

const { Layout } = DefaultTheme;
</script>

<template>
    <Layout>
        <!-- Inject the palette switcher into the navbar's right side, just
             before the dark-mode toggle and social links. The palette is
             global state (`usePalette` from `@vuecs/design`) so it persists across page
             navigation; every Demo.vue iframe receives updates via
             postMessage. -->
        <template #nav-bar-content-after>
            <PaletteSwitch />
        </template>
    </Layout>
</template>
