<script setup lang="ts">
import { sharedRoutes } from '@vuecs-examples/shared/routes';
import { useColorMode } from '@vuecs/design';
import { onMounted, watchEffect } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const { resolved, toggle } = useColorMode();

/*
 * The vuecs design-system toggles `.dark` on <html>. The
 * theme-bootstrap bridge uses that class as the source of truth for
 * `--vc-color-*` flips, but Bootstrap 5.3 components (navbar text,
 * dropdown chrome, form-control bg, etc.) read `--bs-*` vars that
 * Bootstrap itself only flips under `[data-bs-theme="dark"]`. Mirror
 * the resolved color mode onto that attribute so Bootstrap's own
 * dark-mode chain fires alongside vuecs's. Note: `useColorMode`
 * exposes the *resolved* mode (so `system` becomes `light` or `dark`).
 */
const syncBootstrapTheme = () => {
    if (typeof globalThis.document === 'undefined') return;
    globalThis.document.documentElement.setAttribute('data-bs-theme', resolved.value);
};

onMounted(syncBootstrapTheme);
watchEffect(syncBootstrapTheme);
</script>

<template>
    <div class="d-flex flex-column min-vh-100">
        <nav class="navbar navbar-expand-md border-bottom px-3 sticky-top vc-app-bar">
            <span class="navbar-brand fw-semibold">
                <span class="text-primary">vue</span>cs
            </span>
            <span class="navbar-text small">Bootstrap · Vite + Vue 3</span>
            <button
                type="button"
                class="btn btn-outline-secondary btn-sm ms-auto"
                :aria-label="resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                @click="toggle"
            >
                {{ resolved === 'dark' ? '☀' : '☾' }}
            </button>
        </nav>
        <div class="d-flex flex-grow-1">
            <aside
                class="border-end p-3 d-none d-md-block vc-app-aside"
                style="width: 15rem;"
            >
                <nav class="nav flex-column gap-1">
                    <RouterLink
                        to="/"
                        class="nav-link py-1 px-2 small"
                        active-class="active fw-semibold"
                    >
                        Home
                    </RouterLink>
                    <h6 class="text-uppercase text-secondary small mt-3 mb-1">
                        Components
                    </h6>
                    <RouterLink
                        v-for="route in sharedRoutes"
                        :key="route.name"
                        :to="route.path"
                        class="nav-link py-1 px-2 small"
                        active-class="active fw-semibold"
                    >
                        {{ route.label }}
                    </RouterLink>
                </nav>
            </aside>
            <main class="flex-grow-1 overflow-auto p-4">
                <div
                    class="container-fluid"
                    style="max-width: 64rem;"
                >
                    <RouterView />
                </div>
            </main>
        </div>
    </div>
</template>

<style>
/*
 * Bootstrap's `bg-body` / `bg-light` utilities resolve through the
 * `--bs-*-rgb` channel triplets, which the vuecs BS bridge doesn't
 * remap (CSS can't decompose a hex/oklch into r/g/b channels). Set
 * the navbar / sidebar background directly to the design-system token
 * so they flip correctly under `.dark`.
 */
.vc-app-bar,
.vc-app-aside {
    background-color: var(--vc-color-bg);
}
</style>
