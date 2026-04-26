<script setup lang="ts">
import { VCCountdown } from '@vuecs/countdown';

const time = 3600 * 1000;
</script>

<template>
    <VCCountdown :time="time">
        <template #default="props">
            <span
                class="font-medium"
                style="color: var(--vc-color-success-500)"
            >
                {{ props.hours }}h
                {{ props.minutes }}m
                {{ props.seconds }}s
            </span>
            remaining
        </template>
    </VCCountdown>
</template>
