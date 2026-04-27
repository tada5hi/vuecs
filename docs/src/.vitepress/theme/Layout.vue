<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import SettingsModal from './components/SettingsModal.vue';

const { Layout } = DefaultTheme;
</script>

<template>
    <Layout>
        <!-- Inject the appearance/settings trigger into the navbar's right
             side, just after VitePress's social links (GitHub) and before
             the dark-mode toggle. The button opens a `<VCModal>` with
             palette + color-mode controls. Palette state is global
             (`usePalette` from `@vuecs/design`), so changes persist across
             navigation; every Demo.vue iframe receives updates via
             postMessage. -->
        <template #nav-bar-content-after>
            <SettingsModal />
        </template>
    </Layout>
</template>
