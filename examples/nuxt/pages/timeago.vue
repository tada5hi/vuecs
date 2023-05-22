<!--
  - Copyright (c) 2022.
  - Author Peter Placzek (tada5hi)
  - For the full copyright and license information,
  - view the LICENSE file that was distributed with this source code.
  -->

<script lang="ts">
import { Timeago } from '@vue-layout/timeago';
import { getCurrentInstance } from 'vue';
import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
    components: {
        Timeago,
    },
    setup() {
        const instance = getCurrentInstance();
        setTimeout(() => {
            if (instance) {
                instance.appContext.config.globalProperties.$timeagoLocale.value = 'de';
            }
        }, 3600);
        return {
            dateTime: Date.now() - 3600 * 1000,
        };
    },
});
</script>
<template>
    <div class="container">
        <div>
            <h3><i class="fa fa-solid fa-clock" /> Timeago</h3>
            <Timeago :datetime="dateTime" />
        </div>
    </div>
</template>
