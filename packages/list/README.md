# @vuecs/list

[![npm version](https://img.shields.io/npm/v/@vuecs/list)](https://www.npmjs.com/package/@vuecs/list)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The compound list of [vuecs](https://github.com/tada5hi/vuecs)** — a stateful `<VCList>` root plus part components that read from it, with built-in selection, busy/empty states, and an externalizable state container.

## ✨ What's inside

- 🧩 **Five-part compound** — `<VCList>` (state + selection coordinator), `<VCListBody>`, `<VCListItem>`, `<VCListEmpty>`, `<VCListLoading>`. Header / footer / per-row chrome stay *your* markup, styled via slot-prop class strings.
- ☑️ **Built-in selection** — `v-model:selection`, single or multi, full ARIA-listbox semantics with keyboard range selection.
- 🏪 **`defineList()` factory** — Pinia-style external state container; share one list state between the component, a toolbar, and a URL sync without prop-drilling.
- 🪝 **`useList()` / `useListItem()`** — strict injectors for building custom parts that participate in the compound.
- 🎨 **Density variants** — `compact` / `normal` / `spacious`, plus `disabled` / `active` / `selected` item states across all shipping themes.

## 📦 Installation

```bash
npm install @vuecs/list
```

## ⚡ Usage

```vue
<VCList :data="users" :busy="loading" v-model:selection="selected" selection-mode="multi">
    <template #default="{ classes }">
        <header :class="classes.header">Users</header>
        <VCListBody>
            <VCListItem v-for="user in users" :key="user.id" :value="user">
                <template #default="{ classes }">
                    <span :class="classes.text">{{ user.name }}</span>
                    <span :class="classes.actions">
                        <VCButton size="sm" variant="ghost">Edit</VCButton>
                    </span>
                </template>
            </VCListItem>
        </VCListBody>
        <VCListEmpty>No users yet.</VCListEmpty>
        <VCListLoading overlay>Refreshing…</VCListLoading>
    </template>
</VCList>
```

## 📚 Documentation

Full reference, selection semantics, and `defineList()` recipes: **[vuecs.dev/components/list](https://vuecs.dev/components/list)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
