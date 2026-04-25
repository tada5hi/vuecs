<script lang="ts">
import pageFooter from '../components/footer.vue';
import pageHeader from '../components/header.vue';
import pageSidebar from '../components/sidebar.vue';

export default {
    components: {
        pageHeader,
        pageFooter,
        pageSidebar,
    },
};
</script>

<template>
    <div class="flex min-h-screen flex-col bg-bg-muted text-fg">
        <page-header />
        <div class="flex flex-1 pt-14">
            <page-sidebar />
            <main class="flex-1 p-6 overflow-auto">
                <slot />
            </main>
        </div>
        <page-footer />
    </div>
</template>
