# @vuecs/table-card

[![npm version](https://img.shields.io/npm/v/@vuecs/table-card)](https://www.npmjs.com/package/@vuecs/table-card)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The collection card of [vuecs](https://github.com/tada5hi/vuecs)** — `<VCTableCard>` frames a `<VCTable>` with a header (title, description, debounced search, actions), an optional side panel, pagination, and an empty / no-results state that replaces the table. It composes `@vuecs/table`, `@vuecs/elements`, `@vuecs/forms` and `@vuecs/pagination`; generic over the row type.

## 📦 Installation

```bash
npm install @vuecs/table-card @vuecs/table @vuecs/elements @vuecs/forms @vuecs/pagination
```

## ⚡ Usage

```vue
<VCTableCard
    v-model:search="search"
    v-model:sort="sort"
    title="Users"
    searchable
    :data="users.data.value"
    :columns="columns"
    :busy="users.loading.value"
    :filtered="search !== ''"
    :total="users.total.value"
    :limit="10"
    :offset="offset"
    @page="onPage"
    @reset="search = ''"
>
    <template #actions>
        <VCButton>Add user</VCButton>
    </template>
</VCTableCard>
```

## 📚 Documentation

Full reference — states, search, pagination, slots, theming: **[vuecs.dev/components/table-card](https://vuecs.dev/components/table-card)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
