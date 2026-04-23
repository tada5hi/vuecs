<script lang="ts">
import { VCTimeago, injectLocale } from '@vuecs/timeago';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: { VCTimeago },
    setup() {
        const locale = injectLocale();

        setTimeout(() => {
            locale.value = 'de';
        }, 3600);

        return { dateTime: Date.now() - (1000 * 10) };
    },
});
</script>

<template>
    <div class="mx-auto max-w-5xl space-y-4">
        <h3 class="flex items-center gap-2 text-2xl font-semibold">
            <i class="fa fa-solid fa-clock text-blue-500" /> Timeago
        </h3>
        <VCTimeago :datetime="dateTime" />
    </div>
</template>
