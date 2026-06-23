# Changelog

## [4.0.4](https://github.com/tada5hi/vuecs/compare/navigation-v4.0.3...navigation-v4.0.4) (2026-06-23)


### Bug Fixes

* build declarations under strict so polymorphic as/tag prop types survive ([#1650](https://github.com/tada5hi/vuecs/issues/1650)) ([5f6838e](https://github.com/tada5hi/vuecs/commit/5f6838e81444b219d6e2fe81217fbfd3291966d3))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.2.1 to ^3.2.2
  * peerDependencies
    * @vuecs/core bumped from ^3.2.1 to ^3.2.2

## [4.0.3](https://github.com/tada5hi/vuecs/compare/navigation-v4.0.2...navigation-v4.0.3) (2026-06-23)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 12 updates ([#1639](https://github.com/tada5hi/vuecs/issues/1639)) ([4a8386c](https://github.com/tada5hi/vuecs/commit/4a8386c855b8af460f1f2a8228eb464c502ee242))
* restore build and tests under vue 3.5.38 / reka-ui 2.10.0 bump ([#1646](https://github.com/tada5hi/vuecs/issues/1646)) ([d490404](https://github.com/tada5hi/vuecs/commit/d490404d152172b454c70475dfa996d6d445c84f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.2.0 to ^3.2.1
    * @vuecs/link bumped from ^2.0.1 to ^2.0.2
  * peerDependencies
    * @vuecs/core bumped from ^3.2.0 to ^3.2.1
    * @vuecs/link bumped from ^2.0.1 to ^2.0.2

## [4.0.2](https://github.com/tada5hi/vuecs/compare/navigation-v4.0.1...navigation-v4.0.2) (2026-06-08)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.1.2 to ^3.2.0
  * peerDependencies
    * @vuecs/core bumped from ^3.1.2 to ^3.2.0

## [4.0.1](https://github.com/tada5hi/vuecs/compare/navigation-v4.0.0...navigation-v4.0.1) (2026-06-08)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1616](https://github.com/tada5hi/vuecs/issues/1616)) ([cce3b23](https://github.com/tada5hi/vuecs/commit/cce3b2350619a4e6e30ca6c0d5fae4ca3d24d810))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.1.1 to ^3.1.2
  * peerDependencies
    * @vuecs/core bumped from ^3.1.1 to ^3.1.2

## [4.0.0](https://github.com/tada5hi/vuecs/compare/navigation-v3.0.2...navigation-v4.0.0) (2026-06-06)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).

### Features

* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))

## [3.0.2](https://github.com/tada5hi/vuecs/compare/navigation-v3.0.1...navigation-v3.0.2) (2026-06-02)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1604](https://github.com/tada5hi/vuecs/issues/1604)) ([aa834bb](https://github.com/tada5hi/vuecs/commit/aa834bb90e29d9adbc43aa784ccf6e2fd958c048))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.1.0 to ^3.1.1
    * @vuecs/link bumped from ^2.0.0 to ^2.0.1
  * peerDependencies
    * @vuecs/core bumped from ^3.1.0 to ^3.1.1
    * @vuecs/link bumped from ^2.0.0 to ^2.0.1

## [3.0.1](https://github.com/tada5hi/vuecs/compare/navigation-v3.0.0...navigation-v3.0.1) (2026-05-25)


### Bug Fixes

* widen as: prop to accept components across themable components (closes [#1587](https://github.com/tada5hi/vuecs/issues/1587)) ([#1589](https://github.com/tada5hi/vuecs/issues/1589)) ([0362877](https://github.com/tada5hi/vuecs/commit/03628775b43d26c7e0226b0fc70931dbb5de1293))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0
  * peerDependencies
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0

## [3.0.0](https://github.com/tada5hi/vuecs/compare/navigation-v2.4.1...navigation-v3.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* export typed slot prop interfaces per component ([#1502](https://github.com/tada5hi/vuecs/issues/1502)) ([01e2a17](https://github.com/tada5hi/vuecs/commit/01e2a176c5b163c88f64aac41338c5e939c11e0f))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))


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
