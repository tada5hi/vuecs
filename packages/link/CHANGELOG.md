# Changelog

## [2.0.0](https://github.com/tada5hi/vuecs/compare/link-v1.0.1...link-v2.0.0) (2026-05-18)


### ⚠ BREAKING CHANGES

* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))

## [1.0.1](https://github.com/tada5hi/vuecs/compare/link-v1.0.0...link-v1.0.1) (2026-02-18)


### Bug Fixes

* **deps:** bump (dev-)dependencies ([31acd65](https://github.com/tada5hi/vuecs/commit/31acd654d3c14eeba8edae6d889c5c3c48b85f63))

## 1.0.0 (2023-12-19)


### Features

* enable link to keep current query state ([4f33d18](https://github.com/tada5hi/vuecs/commit/4f33d18b9dcf5701f38ece5532b185312ebffc2c))


### Bug Fixes

* build pipeline ([f47eb86](https://github.com/tada5hi/vuecs/commit/f47eb86e8e883c9cdc720dea35a77c1b002c385a))
* minor enhancement for route interaction ([ab616a3](https://github.com/tada5hi/vuecs/commit/ab616a3c73c9931c523a553eff32cdc299fb2c74))
* remove copyright & trigger release ([d23f8af](https://github.com/tada5hi/vuecs/commit/d23f8afe5f3f00201017925bbd0c0e8d421aae99))
* remove vue-router from package ([6e74c00](https://github.com/tada5hi/vuecs/commit/6e74c00afcaf08fb457152ec9bfbcf580ebb463a))
