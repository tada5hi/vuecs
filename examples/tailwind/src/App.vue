<script setup lang="ts">
import { sharedRoutes } from '@vuecs-examples/shared/routes';
import { useColorMode } from '@vuecs/design';
import { RouterLink, RouterView } from 'vue-router';

const { resolved, toggle } = useColorMode();
</script>

<template>
    <div class="flex min-h-screen flex-col bg-bg-muted text-fg">
        <header class="sticky top-0 z-40 border-b border-border bg-bg">
            <div class="flex h-14 items-center gap-3 px-4">
                <div class="text-lg font-semibold tracking-tight text-fg">
                    <span class="text-primary-600 dark:text-primary-400">vue</span><span>cs</span>
                </div>
                <span class="text-sm text-fg-muted">Tailwind · Vite + Vue 3</span>
                <button
                    type="button"
                    class="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md
                        border border-border text-fg hover:bg-bg-muted"
                    :aria-label="resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                    @click="toggle"
                >
                    {{ resolved === 'dark' ? '☀' : '☾' }}
                </button>
            </div>
        </header>
        <div class="flex flex-1">
            <aside class="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-bg overflow-y-auto">
                <nav class="flex flex-col gap-0.5 p-3">
                    <RouterLink
                        to="/"
                        class="rounded-md px-2 py-1 text-sm hover:bg-bg-muted"
                        active-class="bg-bg-muted font-medium"
                    >
                        Home
                    </RouterLink>
                    <div class="mt-3 mb-1 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                        Components
                    </div>
                    <RouterLink
                        v-for="route in sharedRoutes"
                        :key="route.name"
                        :to="route.path"
                        class="rounded-md px-2 py-1 text-sm hover:bg-bg-muted"
                        active-class="bg-bg-muted font-medium"
                    >
                        {{ route.label }}
                    </RouterLink>
                </nav>
            </aside>
            <main class="flex-1 overflow-auto p-6">
                <div class="mx-auto max-w-5xl">
                    <RouterView />
                </div>
            </main>
        </div>
    </div>
</template>
