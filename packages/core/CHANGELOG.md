# Changelog

## [3.0.0](https://github.com/tada5hi/vuecs/compare/core-v2.0.0...core-v3.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* **table:** select-all column + shared selection machine in @vuecs/core ([#1577](https://github.com/tada5hi/vuecs/issues/1577))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add auditTheme() coverage probe (plan 015 P5 / plan 024 s… ([#1548](https://github.com/tada5hi/vuecs/issues/1548)) ([81598fe](https://github.com/tada5hi/vuecs/commit/81598febb38538ae99f68bd564b4d7b2c597e338))
* **core:** add defineTheme() for composing themes that extend others… ([#1544](https://github.com/tada5hi/vuecs/issues/1544)) ([9d89a0d](https://github.com/tada5hi/vuecs/commit/9d89a0d7cd306d7d279041699e69f4584d6a3be5))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add reactive theme resolution via shallowRef and MaybeRef ([#1494](https://github.com/tada5hi/vuecs/issues/1494)) ([ae05292](https://github.com/tada5hi/vuecs/commit/ae05292e736ad4eeef55cf9296b29d81ea38ce0f))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** themable-component helpers + build-themable-component guide ([#1545](https://github.com/tada5hi/vuecs/issues/1545)) ([5535158](https://github.com/tada5hi/vuecs/commit/553515865b283393a03a4be9b10d0474b673eef1))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* introduce @vuecs/icon + Iconify presets ([#1524](https://github.com/tada5hi/vuecs/issues/1524)) ([8a13f5d](https://github.com/tada5hi/vuecs/commit/8a13f5dc7898b6ed175ab679b0cdfd716cf513a6))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* redesign @vuecs/list-controls → @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))
* **table:** select-all column + shared selection machine in @vuecs/core ([#1577](https://github.com/tada5hi/vuecs/issues/1577)) ([9b99d59](https://github.com/tada5hi/vuecs/commit/9b99d59f415cb812ba1ebe43c25cc2124e7a5bf8))


### Bug Fixes

* **deps:** bump pathtrace from 1.1.0 to 2.1.2 in the majorprod group ([#1466](https://github.com/tada5hi/vuecs/issues/1466)) ([2443282](https://github.com/tada5hi/vuecs/commit/2443282aa7a33b327b273ec2acfa6b6e411b1ca8))
* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 7 updates ([#1564](https://github.com/tada5hi/vuecs/issues/1564)) ([d3649af](https://github.com/tada5hi/vuecs/commit/d3649afa0950eb746d84514edd6639b00eaf4800))
* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))

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
