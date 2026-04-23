<script lang="ts">
import { VCCountdown } from '@vuecs/countdown';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: { VCCountdown },
    setup() {
        return { time: 3600 * 1000 };
    },
});
</script>

<template>
    <div class="mx-auto max-w-5xl space-y-4">
        <h3 class="flex items-center gap-2 text-2xl font-semibold">
            <i class="fa fa-solid fa-clock text-blue-500" /> Countdown
        </h3>
        <VCCountdown :time="time">
            <template #default="props">
                The countdown is still running for
                <span class="font-medium text-green-600">
                    {{ props.hours }} hour(s),
                    {{ props.minutes }} minute(s),
                    {{ props.seconds }} second(s)
                </span>.
            </template>
        </VCCountdown>
    </div>
</template>
