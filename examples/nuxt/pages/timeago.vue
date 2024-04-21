<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { VCTimeago, injectLocale } from '@vuecs/timeago';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        VCTimeago,
    },
    setup() {
        const locale = injectLocale();

        setTimeout(() => {
            locale.value = 'de';
        }, 3600);

        return {
            dateTime: Date.now() - (1000 * 10),
        };
    },
});
</script>
<template>
    <div class="container">
        <div>
            <h3><i class="fa fa-solid fa-clock" /> Timeago</h3>
            <VCTimeago :datetime="dateTime" />
        </div>
    </div>
</template>
