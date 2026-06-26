# Changelog

## [1.1.3](https://github.com/tada5hi/vuecs/compare/nuxt-v1.1.2...nuxt-v1.1.3) (2026-06-26)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @vuecs/core bumped from ^3.2.2 to ^3.3.0
    * @vuecs/design bumped from ^1.0.6 to ^1.0.7
    * @vuecs/locale bumped from ^1.0.2 to ^1.0.3

## [1.1.2](https://github.com/tada5hi/vuecs/compare/nuxt-v1.1.1...nuxt-v1.1.2) (2026-06-23)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @vuecs/core bumped from ^3.2.1 to ^3.2.2
    * @vuecs/design bumped from ^1.0.5 to ^1.0.6
    * @vuecs/locale bumped from ^1.0.1 to ^1.0.2

## [1.1.1](https://github.com/tada5hi/vuecs/compare/nuxt-v1.1.0...nuxt-v1.1.1) (2026-06-23)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 12 updates ([#1639](https://github.com/tada5hi/vuecs/issues/1639)) ([4a8386c](https://github.com/tada5hi/vuecs/commit/4a8386c855b8af460f1f2a8228eb464c502ee242))
* restore build and tests under vue 3.5.38 / reka-ui 2.10.0 bump ([#1646](https://github.com/tada5hi/vuecs/issues/1646)) ([d490404](https://github.com/tada5hi/vuecs/commit/d490404d152172b454c70475dfa996d6d445c84f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @vuecs/core bumped from ^3.2.0 to ^3.2.1
    * @vuecs/design bumped from ^1.0.4 to ^1.0.5
    * @vuecs/locale bumped from ^1.0.0 to ^1.0.1

## [1.1.0](https://github.com/tada5hi/vuecs/compare/nuxt-v1.0.3...nuxt-v1.1.0) (2026-06-08)


### Features

* **locale:** browser-aware locale source + core useLocale() + SSR ([#1624](https://github.com/tada5hi/vuecs/issues/1624)) ([9b50f21](https://github.com/tada5hi/vuecs/commit/9b50f21efe43309875fcb7b532d031d223e8f316))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @vuecs/core bumped from ^3.1.2 to ^3.2.0
    * @vuecs/design bumped from ^1.0.3 to ^1.0.4
    * @vuecs/locale bumped from ^0.0.0 to ^1.0.0

## [1.0.3](https://github.com/tada5hi/vuecs/compare/nuxt-v1.0.2...nuxt-v1.0.3) (2026-06-08)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1616](https://github.com/tada5hi/vuecs/issues/1616)) ([cce3b23](https://github.com/tada5hi/vuecs/commit/cce3b2350619a4e6e30ca6c0d5fae4ca3d24d810))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @vuecs/core bumped from ^3.1.1 to ^3.1.2
    * @vuecs/design bumped from ^1.0.2 to ^1.0.3

## [1.0.2](https://github.com/tada5hi/vuecs/compare/nuxt-v1.0.1...nuxt-v1.0.2) (2026-06-02)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1604](https://github.com/tada5hi/vuecs/issues/1604)) ([aa834bb](https://github.com/tada5hi/vuecs/commit/aa834bb90e29d9adbc43aa784ccf6e2fd958c048))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @vuecs/core bumped from ^3.1.0 to ^3.1.1
    * @vuecs/design bumped from ^1.0.1 to ^1.0.2

## [1.0.1](https://github.com/tada5hi/vuecs/compare/nuxt-v1.0.0...nuxt-v1.0.1) (2026-05-25)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 10 updates ([#1590](https://github.com/tada5hi/vuecs/issues/1590)) ([b027606](https://github.com/tada5hi/vuecs/commit/b0276060648b010f53bfb75f856fa344b8614172))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0
    * @vuecs/design bumped from ^1.0.0 to ^1.0.1

## 1.0.0 (2026-05-20)


### ⚠ BREAKING CHANGES

* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* **design,nuxt:** theme-runtime SSR dispatch (plan 021 slice 3) ([#1547](https://github.com/tada5hi/vuecs/issues/1547)) ([11adf35](https://github.com/tada5hi/vuecs/commit/11adf3559142328172893c20978149d8193b56f3))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/design bumped from ^0.0.0 to ^1.0.0
