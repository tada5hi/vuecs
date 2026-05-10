<script setup lang="ts">
import { sharedRoutes } from '@vuecs-examples/shared/routes';
import { useColorMode } from '@vuecs/design';
import { RouterLink, RouterView } from 'vue-router';

/*
 * The `data-theme` attribute is mirrored automatically by theme-bulma's
 * `colorMode.apply` runtime hook (plan 021). No per-app `watchEffect`
 * mirror is needed.
 */
const { resolved, toggle } = useColorMode();
</script>

<template>
    <div class="vcs-shell">
        <nav class="navbar is-light">
            <div class="navbar-brand">
                <span class="navbar-item">
                    <strong><span class="has-text-primary">vue</span>cs</strong>
                </span>
                <span class="navbar-item is-size-7 has-text-grey">Bulma · Vite + Vue 3</span>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <button
                        type="button"
                        class="button is-small is-light"
                        :aria-label="resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                        @click="toggle"
                    >
                        {{ resolved === 'dark' ? '☀' : '☾' }}
                    </button>
                </div>
            </div>
        </nav>
        <div class="columns is-gapless mb-0 vcs-body">
            <aside class="column is-narrow vcs-aside">
                <aside class="menu p-4">
                    <ul class="menu-list">
                        <li>
                            <RouterLink
                                to="/"
                                active-class="is-active"
                            >
                                Home
                            </RouterLink>
                        </li>
                    </ul>
                    <p class="menu-label">
                        Components
                    </p>
                    <ul class="menu-list">
                        <li
                            v-for="route in sharedRoutes"
                            :key="route.name"
                        >
                            <RouterLink
                                :to="route.path"
                                active-class="is-active"
                            >
                                {{ route.label }}
                            </RouterLink>
                        </li>
                    </ul>
                </aside>
            </aside>
            <main class="column">
                <div
                    class="container is-fluid p-5"
                    style="max-width: 64rem;"
                >
                    <RouterView />
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
.vcs-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.vcs-body {
    flex: 1;
}
.vcs-aside {
    width: 16rem;
    border-right: 1px solid var(--vc-color-border);
    overflow-y: auto;
}
</style>
