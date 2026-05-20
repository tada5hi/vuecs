# Changelog

## [3.0.0](https://github.com/tada5hi/vuecs/compare/gravatar-v2.0.0...gravatar-v3.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **gravatar:** extend vue runtime interface with component ([d5a50a8](https://github.com/tada5hi/vuecs/commit/d5a50a8cb1c11001672a8d7abd248e316e2de410))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Bug Fixes

* core package on custom export path ([44d58fd](https://github.com/tada5hi/vuecs/commit/44d58fd3ca0584575bae5cfe6e833b5dafbf8379))
* **deps:** bump (dev-)dependencies ([31acd65](https://github.com/tada5hi/vuecs/commit/31acd654d3c14eeba8edae6d889c5c3c48b85f63))
* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* remove copyright & trigger release ([d23f8af](https://github.com/tada5hi/vuecs/commit/d23f8afe5f3f00201017925bbd0c0e8d421aae99))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/elements bumped from ^1.0.0 to ^2.0.0
  * peerDependencies
    * @vuecs/elements bumped from ^1.0.0 to ^2.0.0

## [2.0.0](https://github.com/tada5hi/vuecs/compare/gravatar-v1.0.2...gravatar-v2.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/elements bumped from ^0.0.0 to ^1.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/elements bumped from ^0.0.0 to ^1.0.0

## [1.0.2](https://github.com/tada5hi/vuecs/compare/gravatar-v1.0.1...gravatar-v1.0.2) (2026-02-18)


### Bug Fixes

* **deps:** bump (dev-)dependencies ([31acd65](https://github.com/tada5hi/vuecs/commit/31acd654d3c14eeba8edae6d889c5c3c48b85f63))

## [1.0.1](https://github.com/tada5hi/vuecs/compare/gravatar-v1.0.0...gravatar-v1.0.1) (2023-12-22)


### Bug Fixes

* core package on custom export path ([44d58fd](https://github.com/tada5hi/vuecs/commit/44d58fd3ca0584575bae5cfe6e833b5dafbf8379))

## 1.0.0 (2023-12-19)


### Bug Fixes

* remove copyright & trigger release ([d23f8af](https://github.com/tada5hi/vuecs/commit/d23f8afe5f3f00201017925bbd0c0e8d421aae99))
