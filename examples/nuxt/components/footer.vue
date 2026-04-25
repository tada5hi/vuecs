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
    <footer class="border-t border-border bg-bg py-3 text-center text-sm text-fg-muted">
        &copy; vuecs {{ year }}
    </footer>
</template>
