# @vuecs/tree

[![npm version](https://img.shields.io/npm/v/@vuecs/tree)](https://www.npmjs.com/package/@vuecs/tree)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The tree view of [vuecs](https://github.com/tada5hi/vuecs)** — a nested item list that **selects** rather than navigates (that's `<VCNavItems>` in `@vuecs/navigation`). Built on Reka UI's `TreeRoot` / `TreeItem` for roving focus, typeahead and WAI-ARIA keyboard navigation; vuecs owns selection, expansion and the cascade.

## ✨ What's inside

- 🔑 **Key-based selection** — `v-model:selection` carries **strings**, not item objects, so a selected node round-trips straight into a `?path=` query parameter. `:multiple` for arrays.
- 🌳 **Cascade + indeterminate** — `:cascade` selects a whole subtree from its parent and reports `aria-checked="mixed"` on partial branches, including collapsed ones.
- 📂 **Controlled expansion** — `v-model:expanded` / `:default-expanded`, plus lazy children via `:load` + `:has-children`.
- 🧩 **Typed items** — `<VCTree>` / `<VCTreeItem>` are generic over `Item`, so `:items` drives typed `#item` / `#toggle` slot props.
- 🛠️ **`parseTreePaths()`** — turn a flat `['users', 'users/employees']` list into nested nodes whose `id` is the full path.
- 🎨 **Two theme keys** — `tree` and `treeItem`; indentation ships in the package's own CSS via `--vc-tree-level`, so it renders correctly with no theme installed.

## 📦 Installation

```bash
npm install @vuecs/tree
```

## ⚡ Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VCTree, parseTreePaths } from '@vuecs/tree';

const items = parseTreePaths(['users', 'users/employees', 'sources/ldap']);
const selection = ref<string | null>(null);
const expanded = ref<string[]>(['users']);
</script>

<template>
    <VCTree
        :items="items"
        v-model:selection="selection"
        v-model:expanded="expanded"
    />
</template>
```

## 📚 Documentation

Full reference — selection, cascade, lazy loading, theming: **[vuecs.dev/components/tree](https://vuecs.dev/components/tree)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
