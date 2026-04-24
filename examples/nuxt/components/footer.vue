<script>
export default {
    computed: {
        year() {
            return new Date().getFullYear();
        },
    },
};
</script>

<template>
    <footer class="border-t border-gray-200 bg-white py-3 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        &copy; vuecs {{ year }}
    </footer>
</template>
