# @vuecs/data

[![npm version](https://img.shields.io/npm/v/@vuecs/data)](https://www.npmjs.com/package/@vuecs/data)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

Loader-backed data-source composables for [vuecs](https://vuecs.dev):
`defineDataCollection()` (binds to `<VCList :state>` and friends) and
`defineDataRecord()` (single-entity source), sharing one async core
(busy / error / latest-wins loading / hydration).

> **Experimental — alpha pre-release channel.** Published as `x.y.z-alpha.N` under the `alpha` npm dist-tag; the API may break between releases without a major bump while the first consumer adapters land.

## 📦 Installation

```sh
npm install @vuecs/data@alpha
```

## 📚 Documentation

See the [data-source guide](https://vuecs.dev/guide/data-source) for API + examples.

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
