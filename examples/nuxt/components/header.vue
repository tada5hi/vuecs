<script lang="ts">
import { VCGravatar } from '@vuecs/gravatar';
import { VCNavItems } from '@vuecs/navigation';
import { ref } from 'vue';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        VCGravatar,
        VCNavItems,
    },
    setup() {
        const displayNav = ref(false);

        const toggleNav = () => {
            displayNav.value = !displayNav.value;
        };

        return {
            toggleNav,
            displayNav,
        };
    },
});
</script>

<template>
    <header class="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white">
        <div class="flex h-14 items-center gap-3 px-4">
            <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 md:hidden"
                @click="toggleNav"
            >
                <span class="sr-only">Toggle navigation</span>
                <i class="fa fa-bars" />
            </button>

            <div class="text-lg font-semibold tracking-tight">
                <span class="text-blue-600">vue</span><span>cs</span>
            </div>

            <VCNavItems
                class="ml-4 hidden md:flex"
                :theme-class="{ group: 'flex items-center gap-1' }"
                :level="0"
            />

            <a
                href="javascript:void(0)"
                class="ml-auto inline-flex items-center"
            >
                <VCGravatar
                    email="peter.placzek1996@gmail.com"
                    :theme-class="{ root: 'h-8 w-8' }"
                />
            </a>
        </div>

        <div
            v-if="displayNav"
            class="border-t border-gray-200 px-4 py-2 md:hidden"
        >
            <VCNavItems
                :theme-class="{ group: 'flex flex-col gap-0.5' }"
                :level="0"
            />
            <VCNavItems
                :theme-class="{ group: 'mt-2 flex flex-col gap-0.5 border-t border-gray-200 pt-2' }"
                :level="1"
            />
        </div>
    </header>
</template>
