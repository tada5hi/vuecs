# @vuecs/table

Compound table for vuecs — `<VCTable>` outer + nine semantic-HTML parts (`Header` / `Body` / `Footer` / `Row` / `Cell` / `HeadCell` / `Empty` / `Loading`) with a columns/data driver, single-column controlled sort, optional row keyboard navigation, and row-meta variants. Layered on top of `@vuecs/core`'s theme system.

## Installation

```bash
npm install @vuecs/table
```

## Usage

See the [vuecs.dev documentation](https://vuecs.dev/components/table) for full API + theme reference.

### Driver shape (recommended)

```vue
<script setup lang="ts">
import { VCTable, VCTableEmpty } from '@vuecs/table';
</script>

<template>
    <VCTable
        :columns="[
            { key: 'name', label: 'Name', sortable: true, isRowHeader: true },
            { key: 'email', label: 'Email' },
        ]"
        :data="users"
        v-model:sort="sort"
        :busy="loading"
    >
        <template #cell-email="{ value }">
            <a :href="`mailto:${value}`">{{ value }}</a>
        </template>
        <VCTableEmpty>No users yet.</VCTableEmpty>
    </VCTable>
</template>
```

### Compound shape (escape hatch)

```vue
<VCTable :data="orders">
    <VCTableHeader>
        <VCTableRow>
            <VCTableHeadCell>Order</VCTableHeadCell>
            <VCTableHeadCell>Customer</VCTableHeadCell>
        </VCTableRow>
    </VCTableHeader>
    <VCTableBody>
        <template #row="{ row }">
            <VCTableRow>
                <VCTableCell>#{{ row.id }}</VCTableCell>
                <VCTableCell>{{ row.customer }}</VCTableCell>
            </VCTableRow>
        </template>
    </VCTableBody>
</VCTable>
```
