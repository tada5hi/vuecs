<script setup lang="ts">
import { VCFormTextarea } from '@vuecs/forms';
import { ref } from 'vue';
import { variantState } from './iframe-bridge';

const value = ref('');
</script>

<template>
    <div style="max-width: 32rem;">
        <VCFormTextarea
            v-model="value"
            placeholder="Type a longer message..."
            rows="4"
            :theme-variant="variantState"
        />
    </div>
</template>
