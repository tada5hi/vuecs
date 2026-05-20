# @vuecs/placeholder

Skeleton / placeholder loading components for vuecs. Use them to show
animated shapes while content is loading — the "Twitter / Facebook
shimmer" pattern.

```bash
npm install @vuecs/placeholder
```

```vue
<script setup>
import { VCPlaceholderTable, VCPlaceholderWrapper } from '@vuecs/placeholder';
</script>

<template>
    <VCPlaceholderWrapper :loading="busy">
        <template #loading>
            <VCPlaceholderTable :rows="5" :columns="7" />
        </template>
        <template #default>
            <!-- real content -->
        </template>
    </VCPlaceholderWrapper>
</template>
```

Full docs + variants: [vuecs.dev/components/placeholder](https://vuecs.dev/components/placeholder).
