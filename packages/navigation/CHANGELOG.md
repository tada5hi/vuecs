# Changelog

## [3.0.0](https://github.com/tada5hi/vuecs/compare/navigation-v2.4.1...navigation-v3.0.0) (2026-04-27)


### ⚠ BREAKING CHANGES

* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* export typed slot prop interfaces per component ([#1502](https://github.com/tada5hi/vuecs/issues/1502)) ([01e2a17](https://github.com/tada5hi/vuecs/commit/01e2a176c5b163c88f64aac41338c5e939c11e0f))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/link bumped from ^1.0.1 to ^2.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/link bumped from ^1.0.1 to ^2.0.0

## [2.4.1](https://github.com/tada5hi/vuecs/compare/navigation-v2.4.0...navigation-v2.4.1) (2026-02-18)


### Bug Fixes

* **deps:** bump (dev-)dependencies ([31acd65](https://github.com/tada5hi/vuecs/commit/31acd654d3c14eeba8edae6d889c5c3c48b85f63))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/link bumped from ^1.0.0 to ^1.0.1
  * peerDependencies
    * @vuecs/link bumped from ^1.0.0 to ^1.0.1

## [2.4.0](https://github.com/tada5hi/vuecs/compare/navigation-v2.3.1...navigation-v2.4.0) (2025-04-01)


### Features

* dedicated reset method to reset cached items (+active) ([5f8a0c5](https://github.com/tada5hi/vuecs/commit/5f8a0c518eeca1b28d3c2cc88ab3b0a43340fbbe))

## [2.3.1](https://github.com/tada5hi/vuecs/compare/navigation-v2.3.0...navigation-v2.3.1) (2024-10-24)


### Bug Fixes

* optimize item score calculation ([4b7ba1a](https://github.com/tada5hi/vuecs/commit/4b7ba1a82163978213e21505ba7375687a20f2d0))
* remove root link identification ([2568ea2](https://github.com/tada5hi/vuecs/commit/2568ea2d6234a5080f75432439c29df1494aa327))

## [2.3.0](https://github.com/tada5hi/vuecs/compare/navigation-v2.2.0...navigation-v2.3.0) (2024-10-23)


### Features

* extend navigation-item type with generic argument ([3c1c081](https://github.com/tada5hi/vuecs/commit/3c1c0816f75a21762dfc8a03f50f962ad4f97616))

## [2.2.0](https://github.com/tada5hi/vuecs/compare/navigation-v2.1.0...navigation-v2.2.0) (2024-10-17)


### Features

* enhance preset css and reorder navigation link elements ([6705bed](https://github.com/tada5hi/vuecs/commit/6705bed34cf2e028e190869534ebb01d43559513))

## [2.1.0](https://github.com/tada5hi/vuecs/compare/navigation-v2.0.0...navigation-v2.1.0) (2024-10-17)


### Features

* introduce buildOnce method for navigation manager ([b3e195b](https://github.com/tada5hi/vuecs/commit/b3e195b875ee97988972e90196620f723af1e9cc))

## [2.0.0](https://github.com/tada5hi/vuecs/compare/navigation-v1.1.1...navigation-v2.0.0) (2024-10-16)


### ⚠ BREAKING CHANGES

* public api changed

### Features

* optimized select fn of navigation manager ([b7a8097](https://github.com/tada5hi/vuecs/commit/b7a809754c8fa769966a10fa5f1a8492f3b75f8a))
* refactored and optimized navigation package ([#1281](https://github.com/tada5hi/vuecs/issues/1281)) ([271d80e](https://github.com/tada5hi/vuecs/commit/271d80e379fbeb5e587dc827769eeed6ddee4242))


### Bug Fixes

* renamed few style classes ([88b1c50](https://github.com/tada5hi/vuecs/commit/88b1c50375efa1c7578c99f5f6c5eb1f3b356658))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^1.2.0 to ^2.0.0
  * peerDependencies
    * @vuecs/core bumped from ^1.2.0 to ^2.0.0

## [1.1.1](https://github.com/tada5hi/vuecs/compare/navigation-v1.1.0...navigation-v1.1.1) (2023-12-22)


### Bug Fixes

* core package on custom export path ([44d58fd](https://github.com/tada5hi/vuecs/commit/44d58fd3ca0584575bae5cfe6e833b5dafbf8379))
* fn to apply store manager options ([41836ea](https://github.com/tada5hi/vuecs/commit/41836eae3502b5c1854eacf801d2c64f08fcd650))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^1.1.0 to ^1.2.0
  * peerDependencies
    * @vuecs/core bumped from ^1.1.0 to ^1.2.0

## [1.1.0](https://github.com/tada5hi/vuecs/compare/navigation-v1.0.0...navigation-v1.1.0) (2023-12-21)


### Features

* refactor and enhanced component options management ([e5edb6d](https://github.com/tada5hi/vuecs/commit/e5edb6d354a44f242a952385db85e14c1b0be223))


### Bug Fixes

* options schema for component packages ([33751f8](https://github.com/tada5hi/vuecs/commit/33751f8a0295ef821063cb3243bfa2c08a010fad))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^1.0.0 to ^1.1.0
  * peerDependencies
    * @vuecs/core bumped from ^1.0.0 to ^1.1.0

## 1.0.0 (2023-12-19)


### Bug Fixes

* remove copyright & trigger release ([d23f8af](https://github.com/tada5hi/vuecs/commit/d23f8afe5f3f00201017925bbd0c0e8d421aae99))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^0.0.0 to ^1.0.0
    * @vuecs/link bumped from ^0.0.0 to ^1.0.0
  * peerDependencies
    * @vuecs/core bumped from ^0.0.0 to ^1.0.0
    * @vuecs/link bumped from ^0.0.0 to ^1.0.0
