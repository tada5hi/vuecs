# Changelog

## 1.0.0 (2026-05-18)


### ⚠ BREAKING CHANGES

* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* **design,nuxt:** theme-runtime SSR dispatch (plan 021 slice 3) ([#1547](https://github.com/tada5hi/vuecs/issues/1547)) ([11adf35](https://github.com/tada5hi/vuecs/commit/11adf3559142328172893c20978149d8193b56f3))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01… ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 7 updates ([#1564](https://github.com/tada5hi/vuecs/issues/1564)) ([d3649af](https://github.com/tada5hi/vuecs/commit/d3649afa0950eb746d84514edd6639b00eaf4800))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
