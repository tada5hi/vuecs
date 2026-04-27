# Changelog

## [2.0.0](https://github.com/tada5hi/vuecs/compare/pagination-v1.3.1...pagination-v2.0.0) (2026-04-27)


### ⚠ BREAKING CHANGES

* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Public api changed
* change architecture

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* drop meta prop in favor of v-bind spread ([e188248](https://github.com/tada5hi/vuecs/commit/e188248691c0c7427c7e433441ab95ef435a97ce))
* **pagination:** swap internals to reka-ui primitives ([0a6ef55](https://github.com/tada5hi/vuecs/commit/0a6ef55ff7e980cec320e33c368516d90b5a2b4d))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0

## [1.3.1](https://github.com/tada5hi/vuecs/compare/pagination-v1.3.0...pagination-v1.3.1) (2026-02-18)


### Bug Fixes

* **deps:** bump (dev-)dependencies ([31acd65](https://github.com/tada5hi/vuecs/commit/31acd654d3c14eeba8edae6d889c5c3c48b85f63))

## [1.3.0](https://github.com/tada5hi/vuecs/compare/pagination-v1.2.0...pagination-v1.3.0) (2024-10-23)


### Features

* **pagination:** jump button for first & last page ([528a7be](https://github.com/tada5hi/vuecs/commit/528a7be78d3a8e9fa6e26814184d62d32a994a6f))

## [1.2.0](https://github.com/tada5hi/vuecs/compare/pagination-v1.1.1...pagination-v1.2.0) (2024-10-16)


### Features

* css preset for list-controls ([3e7e698](https://github.com/tada5hi/vuecs/commit/3e7e698d515f0c37f811964c72222c8c14e1183c))
* custom css classes for pagination package ([32f13d2](https://github.com/tada5hi/vuecs/commit/32f13d2a9e39ae09f6d16f29cbd143f1f3118cd0))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^1.2.0 to ^2.0.0
  * peerDependencies
    * @vuecs/core bumped from ^1.2.0 to ^2.0.0

## [1.1.1](https://github.com/tada5hi/vuecs/compare/pagination-v1.1.0...pagination-v1.1.1) (2023-12-22)


### Bug Fixes

* core package on custom export path ([44d58fd](https://github.com/tada5hi/vuecs/commit/44d58fd3ca0584575bae5cfe6e833b5dafbf8379))
* fn to apply store manager options ([41836ea](https://github.com/tada5hi/vuecs/commit/41836eae3502b5c1854eacf801d2c64f08fcd650))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^1.1.0 to ^1.2.0
  * peerDependencies
    * @vuecs/core bumped from ^1.1.0 to ^1.2.0

## [1.1.0](https://github.com/tada5hi/vuecs/compare/pagination-v1.0.0...pagination-v1.1.0) (2023-12-21)


### Features

* refactor and enhanced component options management ([e5edb6d](https://github.com/tada5hi/vuecs/commit/e5edb6d354a44f242a952385db85e14c1b0be223))


### Bug Fixes

* options schema for component packages ([33751f8](https://github.com/tada5hi/vuecs/commit/33751f8a0295ef821063cb3243bfa2c08a010fad))
* typing for pagination package ([118229a](https://github.com/tada5hi/vuecs/commit/118229a338101896d85c0756a4516e0f08a08dd3))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^1.0.0 to ^1.1.0
  * peerDependencies
    * @vuecs/core bumped from ^1.0.0 to ^1.1.0

## 1.0.0 (2023-12-19)


### Features

* **pagination:** add default styling + provide utilities ([df7e4c5](https://github.com/tada5hi/vuecs/commit/df7e4c5b29417ea802c0cc049a67d96859ec4621))


### Bug Fixes

* remove copyright & trigger release ([d23f8af](https://github.com/tada5hi/vuecs/commit/d23f8afe5f3f00201017925bbd0c0e8d421aae99))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^0.0.0 to ^1.0.0
  * peerDependencies
    * @vuecs/core bumped from ^0.0.0 to ^1.0.0
