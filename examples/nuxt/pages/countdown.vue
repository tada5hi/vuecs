<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { VCCountdown } from '@vuecs/countdown';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        VCCountdown,
    },
    setup() {
        return {
            time: 3600 * 1000,
        };
    },
});
</script>
<template>
    <div class="container">
        <div>
            <h3><i class="fa fa-solid fa-clock" /> Countdown</h3>
            <VCCountdown :time="time">
                <template #default="props">
                    The countdown is still running for
                    <span class="text-success">
                        {{ props.hours }} hour(s),
                        {{ props.minutes }} minute(s),
                        {{ props.seconds }} second(s)
                    </span>.
                </template>
            </VCCountdown>
        </div>
    </div>
</template>
