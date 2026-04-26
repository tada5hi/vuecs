<script setup lang="ts">
import { VCFormTextarea } from '@vuecs/form-controls';
import { ref } from 'vue';

const value = ref('');
</script>

<template>
    <div style="max-width: 32rem;">
        <VCFormTextarea
            v-model="value"
            placeholder="Type a longer message..."
            rows="4"
        />
    </div>
</template>
