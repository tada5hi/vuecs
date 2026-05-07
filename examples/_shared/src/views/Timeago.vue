<script setup lang="ts">
import { VCTimeago } from '@vuecs/timeago';

const tenSecondsAgo = Date.now() - 10_000;
const oneHourAgo = Date.now() - 60 * 60 * 1000;
const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <VCTimeago :datetime="tenSecondsAgo" />
        <VCTimeago :datetime="oneHourAgo" />
        <VCTimeago :datetime="oneDayAgo" />
    </div>
</template>
