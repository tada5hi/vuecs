# Changelog

## [3.0.0](https://github.com/tada5hi/vuecs/compare/core-v2.0.0...core-v3.0.0) (2026-04-27)


### ⚠ BREAKING CHANGES

* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add reactive theme resolution via shallowRef and MaybeRef ([#1494](https://github.com/tada5hi/vuecs/issues/1494)) ([ae05292](https://github.com/tada5hi/vuecs/commit/ae05292e736ad4eeef55cf9296b29d81ea38ce0f))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))


### Bug Fixes

* **deps:** bump pathtrace from 1.1.0 to 2.1.2 in the majorprod group ([#1466](https://github.com/tada5hi/vuecs/issues/1466)) ([2443282](https://github.com/tada5hi/vuecs/commit/2443282aa7a33b327b273ec2acfa6b6e411b1ca8))

## [2.0.0](https://github.com/tada5hi/vuecs/compare/core-v1.2.0...core-v2.0.0) (2024-10-16)


### ⚠ BREAKING CHANGES

* public api changed

### Features

* provide pick-components-options helper ([e4d40b0](https://github.com/tada5hi/vuecs/commit/e4d40b0d32cd57cfda12da44fe30e11f6952f0c8))
* refactored and optimized navigation package ([#1281](https://github.com/tada5hi/vuecs/issues/1281)) ([271d80e](https://github.com/tada5hi/vuecs/commit/271d80e379fbeb5e587dc827769eeed6ddee4242))

## [1.2.0](https://github.com/tada5hi/vuecs/compare/core-v1.1.0...core-v1.2.0) (2023-12-22)


### Features

* allow passing custom storeManager instance to component-options-manager ([74a9ed8](https://github.com/tada5hi/vuecs/commit/74a9ed8a5572d87f7da214865c979b010e888797))


### Bug Fixes

* core package on custom export path ([44d58fd](https://github.com/tada5hi/vuecs/commit/44d58fd3ca0584575bae5cfe6e833b5dafbf8379))
* fn to apply store manager options ([41836ea](https://github.com/tada5hi/vuecs/commit/41836eae3502b5c1854eacf801d2c64f08fcd650))

## [1.1.0](https://github.com/tada5hi/vuecs/compare/core-v1.0.0...core-v1.1.0) (2023-12-21)


### Features

* refactor and enhanced component options management ([e5edb6d](https://github.com/tada5hi/vuecs/commit/e5edb6d354a44f242a952385db85e14c1b0be223))

## 1.0.0 (2023-12-19)


### Features

* enhanced and simplified ref utils ([74c984e](https://github.com/tada5hi/vuecs/commit/74c984ec102a2afc8df999d44003b85e555e1c94))


### Bug Fixes

* don't expose merge fn in core package ([27ff7e1](https://github.com/tada5hi/vuecs/commit/27ff7e1cb42d4b84b659bc0d277de53725ff6505))
* remove copyright & trigger release ([d23f8af](https://github.com/tada5hi/vuecs/commit/d23f8afe5f3f00201017925bbd0c0e8d421aae99))
