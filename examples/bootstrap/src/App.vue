<script setup lang="ts">
import { sharedRoutes } from '@vuecs-examples/shared/routes';
import { useColorMode } from '@vuecs/design';
import { RouterLink, RouterView } from 'vue-router';

const { resolved, toggle } = useColorMode();
</script>

<template>
    <div class="d-flex flex-column min-vh-100">
        <nav class="navbar navbar-expand-md border-bottom px-3 sticky-top bg-body">
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
                class="border-end bg-body p-3 d-none d-md-block"
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
