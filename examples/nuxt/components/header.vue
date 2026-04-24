<script lang="ts">
import { VCGravatar } from '@vuecs/gravatar';
import { VCNavItems } from '@vuecs/navigation';
import { ref } from 'vue';
import { defineNuxtComponent } from '#app';
import { useColorMode } from '../composables/useColorMode';

export default defineNuxtComponent({
    components: {
        VCGravatar,
        VCNavItems,
    },
    setup() {
        const displayNav = ref(false);
        const { mode, toggle: toggleColorMode } = useColorMode();

        const toggleNav = () => {
            displayNav.value = !displayNav.value;
        };

        return {
            toggleNav,
            displayNav,
            colorMode: mode,
            toggleColorMode,
        };
    },
});
</script>

<template>
    <header class="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-14 items-center gap-3 px-4">
            <button
                type="button"
                :class="[
                    'inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden',
                    'border border-gray-300 text-gray-700 hover:bg-gray-100',
                    'dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800',
                ]"
                @click="toggleNav"
            >
                <span class="sr-only">Toggle navigation</span>
                <i class="fa fa-bars" />
            </button>

            <div class="text-lg font-semibold tracking-tight dark:text-gray-100">
                <span class="text-blue-600 dark:text-blue-400">vue</span><span>cs</span>
            </div>

            <VCNavItems
                class="ml-4 hidden md:flex"
                :theme-class="{ group: 'flex items-center gap-1' }"
                :level="0"
            />

            <button
                type="button"
                :class="[
                    'ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md',
                    'border border-gray-300 text-gray-700 hover:bg-gray-100',
                    'dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800',
                ]"
                :aria-label="colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                @click="toggleColorMode"
            >
                <i :class="colorMode === 'dark' ? 'fa-regular fa-sun' : 'fa-regular fa-moon'" />
            </button>

            <a
                href="javascript:void(0)"
                class="inline-flex items-center"
            >
                <VCGravatar
                    email="peter.placzek1996@gmail.com"
                    :theme-class="{ root: 'h-8 w-8' }"
                />
            </a>
        </div>

        <div
            v-if="displayNav"
            class="border-t border-gray-200 px-4 py-2 md:hidden dark:border-gray-800"
        >
            <VCNavItems
                :theme-class="{ group: 'flex flex-col gap-0.5' }"
                :level="0"
            />
            <VCNavItems
                :theme-class="{ group: 'mt-2 flex flex-col gap-0.5 border-t border-gray-200 pt-2 dark:border-gray-800' }"
                :level="1"
            />
        </div>
    </header>
</template>
