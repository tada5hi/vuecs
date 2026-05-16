# @vuecs/list

[![npm version](https://badge.fury.io/js/@vuecs%2Flist.svg)](https://badge.fury.io/js/@vuecs%2Flist)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Compound list components for Vue 3: a stateful root (`<VCList>`) plus four part components — `<VCListBody>`, `<VCListItem>`, `<VCListEmpty>`, `<VCListLoading>` — that read from it. Header / footer / item-text / item-actions chrome is consumer markup driven by slot-prop class strings exposed on the root and item defaults. Ships a `defineList()` factory (Pinia-style external state) plus `useList()` / `useListItem()` injectors and built-in `v-model:selection` (single / multi, ARIA listbox). Successor to `@vuecs/list-controls` — clean break, compound API.

Full documentation: **[vuecs.dev/components/list](https://vuecs.dev/components/list)**

```bash
npm install @vuecs/list
```

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
