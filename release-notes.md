:robot: I have created a release *beep* *boop*
---


<details><summary>button: 1.0.0</summary>

## 1.0.0 (2026-05-20)


### Features

* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* introduce @vuecs/icon + Iconify presets ([#1524](https://github.com/tada5hi/vuecs/issues/1524)) ([8a13f5d](https://github.com/tada5hi/vuecs/commit/8a13f5dc7898b6ed175ab679b0cdfd716cf513a6))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/icon bumped from ^0.0.0 to ^1.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/icon bumped from ^0.0.0 to ^1.0.0
</details>

<details><summary>core: 3.0.0</summary>

## [3.0.0](https://github.com/tada5hi/vuecs/compare/core-v2.0.0...core-v3.0.0) (2026-05-20)


###   BREAKING CHANGES

* **table:** select-all column + shared selection machine in @vuecs/core ([#1577](https://github.com/tada5hi/vuecs/issues/1577))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` ’ `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, &) for symmetry with `useColorMode`.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add auditTheme() coverage probe (plan 015 P5 / plan 024 s& ([#1548](https://github.com/tada5hi/vuecs/issues/1548)) ([81598fe](https://github.com/tada5hi/vuecs/commit/81598febb38538ae99f68bd564b4d7b2c597e338))
* **core:** add defineTheme() for composing themes that extend others& ([#1544](https://github.com/tada5hi/vuecs/issues/1544)) ([9d89a0d](https://github.com/tada5hi/vuecs/commit/9d89a0d7cd306d7d279041699e69f4584d6a3be5))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add reactive theme resolution via shallowRef and MaybeRef ([#1494](https://github.com/tada5hi/vuecs/issues/1494)) ([ae05292](https://github.com/tada5hi/vuecs/commit/ae05292e736ad4eeef55cf9296b29d81ea38ce0f))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** themable-component helpers + build-themable-component guide ([#1545](https://github.com/tada5hi/vuecs/issues/1545)) ([5535158](https://github.com/tada5hi/vuecs/commit/553515865b283393a03a4be9b10d0474b673eef1))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is& ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* introduce @vuecs/icon + Iconify presets ([#1524](https://github.com/tada5hi/vuecs/issues/1524)) ([8a13f5d](https://github.com/tada5hi/vuecs/commit/8a13f5dc7898b6ed175ab679b0cdfd716cf513a6))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* redesign @vuecs/list-controls ’ @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))
* **table:** select-all column + shared selection machine in @vuecs/core ([#1577](https://github.com/tada5hi/vuecs/issues/1577)) ([9b99d59](https://github.com/tada5hi/vuecs/commit/9b99d59f415cb812ba1ebe43c25cc2124e7a5bf8))


### Bug Fixes

* **deps:** bump pathtrace from 1.1.0 to 2.1.2 in the majorprod group ([#1466](https://github.com/tada5hi/vuecs/issues/1466)) ([2443282](https://github.com/tada5hi/vuecs/commit/2443282aa7a33b327b273ec2acfa6b6e411b1ca8))
* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 7 updates ([#1564](https://github.com/tada5hi/vuecs/issues/1564)) ([d3649af](https://github.com/tada5hi/vuecs/commit/d3649afa0950eb746d84514edd6639b00eaf4800))
* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))
</details>

<details><summary>countdown: 2.0.0</summary>

## [2.0.0](https://github.com/tada5hi/vuecs/compare/countdown-v1.0.1...countdown-v2.0.0) (2026-05-20)


###   BREAKING CHANGES

* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* **countdown:** expose isCounting state ([7e07b42](https://github.com/tada5hi/vuecs/commit/7e07b429bfd2b5e395c47f8d3072e72eeb0580b5))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* export typed slot prop interfaces per component ([#1502](https://github.com/tada5hi/vuecs/issues/1502)) ([01e2a17](https://github.com/tada5hi/vuecs/commit/01e2a176c5b163c88f64aac41338c5e939c11e0f))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>design: 1.0.0</summary>

## 1.0.0 (2026-05-20)


###   BREAKING CHANGES

* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl& ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` ’ `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, &) for symmetry with `useColorMode`.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* **design,nuxt:** theme-runtime SSR dispatch (plan 021 slice 3) ([#1547](https://github.com/tada5hi/vuecs/issues/1547)) ([11adf35](https://github.com/tada5hi/vuecs/commit/11adf3559142328172893c20978149d8193b56f3))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01& ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl& ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 7 updates ([#1564](https://github.com/tada5hi/vuecs/issues/1564)) ([d3649af](https://github.com/tada5hi/vuecs/commit/d3649afa0950eb746d84514edd6639b00eaf4800))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>elements: 1.0.0</summary>

## 1.0.0 (2026-05-20)


###   BREAKING CHANGES

* <VCTagList> is gone  use <VCTags>. The package is unreleased so no compat shim ships.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* **core:** themable-component helpers + build-themable-component guide ([#1545](https://github.com/tada5hi/vuecs/issues/1545)) ([5535158](https://github.com/tada5hi/vuecs/commit/553515865b283393a03a4be9b10d0474b673eef1))
* demo/playground split, stepper context, structural-CSS color is& ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display& ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound  VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **elements,theme-bootstrap:** structural CSS no longer clobbers themes ([49734ae](https://github.com/tada5hi/vuecs/commit/49734ae973a95f497d564579debe15c44288dfdf))
* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>forms: 4.0.0</summary>

## [4.0.0](https://github.com/tada5hi/vuecs/compare/forms-v3.0.0...forms-v4.0.0) (2026-05-20)


###   BREAKING CHANGES

* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* demo/playground split, stepper context, structural-CSS color is& ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>gravatar: 2.0.0</summary>

## [2.0.0](https://github.com/tada5hi/vuecs/compare/gravatar-v1.0.2...gravatar-v2.0.0) (2026-05-20)


###   BREAKING CHANGES

* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />&</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies  its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display& ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
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
</details>

<details><summary>icon: 1.0.0</summary>

## 1.0.0 (2026-05-20)


### Features

* introduce @vuecs/icon + Iconify presets ([#1524](https://github.com/tada5hi/vuecs/issues/1524)) ([8a13f5d](https://github.com/tada5hi/vuecs/commit/8a13f5dc7898b6ed175ab679b0cdfd716cf513a6))


### Bug Fixes

* **deps:** bump @iconify/vue from 4.3.0 to 5.0.0 in the majorprod group ([#1534](https://github.com/tada5hi/vuecs/issues/1534)) ([e46d121](https://github.com/tada5hi/vuecs/commit/e46d1216c674c17e5254ff8df5b91b8b0e164e03))
* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
</details>

<details><summary>icons-font-awesome: 1.0.0</summary>

## 1.0.0 (2026-05-20)


### Features

* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* introduce @vuecs/icon + Iconify presets ([#1524](https://github.com/tada5hi/vuecs/issues/1524)) ([8a13f5d](https://github.com/tada5hi/vuecs/commit/8a13f5dc7898b6ed175ab679b0cdfd716cf513a6))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>icons-lucide: 1.0.0</summary>

## 1.0.0 (2026-05-20)


### Features

* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* introduce @vuecs/icon + Iconify presets ([#1524](https://github.com/tada5hi/vuecs/issues/1524)) ([8a13f5d](https://github.com/tada5hi/vuecs/commit/8a13f5dc7898b6ed175ab679b0cdfd716cf513a6))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>link: 2.0.0</summary>

## [2.0.0](https://github.com/tada5hi/vuecs/compare/link-v1.0.1...link-v2.0.0) (2026-05-20)


###   BREAKING CHANGES

* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))
</details>

<details><summary>list: 1.0.0</summary>

## 1.0.0 (2026-05-20)


###   BREAKING CHANGES

* **table:** select-all column + shared selection machine in @vuecs/core ([#1577](https://github.com/tada5hi/vuecs/issues/1577))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))

### Features

* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* redesign @vuecs/list-controls ’ @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* **table:** select-all column + shared selection machine in @vuecs/core ([#1577](https://github.com/tada5hi/vuecs/issues/1577)) ([9b99d59](https://github.com/tada5hi/vuecs/commit/9b99d59f415cb812ba1ebe43c25cc2124e7a5bf8))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 7 updates ([#1564](https://github.com/tada5hi/vuecs/issues/1564)) ([d3649af](https://github.com/tada5hi/vuecs/commit/d3649afa0950eb746d84514edd6639b00eaf4800))
* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>navigation: 3.0.0</summary>

## [3.0.0](https://github.com/tada5hi/vuecs/compare/navigation-v2.4.1...navigation-v3.0.0) (2026-05-20)


###   BREAKING CHANGES

* <VCTagList> is gone  use <VCTags>. The package is unreleased so no compat shim ships.
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
* demo/playground split, stepper context, structural-CSS color is& ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* export typed slot prop interfaces per component ([#1502](https://github.com/tada5hi/vuecs/issues/1502)) ([01e2a17](https://github.com/tada5hi/vuecs/commit/01e2a176c5b163c88f64aac41338c5e939c11e0f))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
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
</details>

<details><summary>nuxt: 1.0.0</summary>

## 1.0.0 (2026-05-20)


###   BREAKING CHANGES

* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl& ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` ’ `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, &) for symmetry with `useColorMode`.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* **design,nuxt:** theme-runtime SSR dispatch (plan 021 slice 3) ([#1547](https://github.com/tada5hi/vuecs/issues/1547)) ([11adf35](https://github.com/tada5hi/vuecs/commit/11adf3559142328172893c20978149d8193b56f3))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl& ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/design bumped from ^0.0.0 to ^1.0.0
</details>

<details><summary>examples-nuxt: 4.0.0</summary>

## [4.0.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v3.5.0...examples-nuxt-v4.0.0) (2026-05-20)


###   BREAKING CHANGES

* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl& ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` ’ `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, &) for symmetry with `useColorMode`.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Public api changed
* change architecture

### Features

* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* drop meta prop in favor of v-bind spread ([e188248](https://github.com/tada5hi/vuecs/commit/e188248691c0c7427c7e433441ab95ef435a97ce))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound  VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* introduce @vuecs/icon + Iconify presets ([#1524](https://github.com/tada5hi/vuecs/issues/1524)) ([8a13f5d](https://github.com/tada5hi/vuecs/commit/8a13f5dc7898b6ed175ab679b0cdfd716cf513a6))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl& ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* per-theme example apps + shared demo views ([#1539](https://github.com/tada5hi/vuecs/issues/1539)) ([0da8c64](https://github.com/tada5hi/vuecs/commit/0da8c64f59f4d74aa4c875854c2e4045413b6502))
* redesign @vuecs/list-controls ’ @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))
* **table:** row selection v-model + ARIA grid (plan 033 v1.x-A) ([#1574](https://github.com/tada5hi/vuecs/issues/1574)) ([f9aab3e](https://github.com/tada5hi/vuecs/commit/f9aab3e12912e3f25d5fcab74740268f6de6af5f))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **deps:** bump @iconify/vue from 4.3.0 to 5.0.0 in the majorprod group ([#1534](https://github.com/tada5hi/vuecs/issues/1534)) ([e46d121](https://github.com/tada5hi/vuecs/commit/e46d1216c674c17e5254ff8df5b91b8b0e164e03))
* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^0.0.0 to ^1.0.0
    * @vuecs/countdown bumped from ^1.0.1 to ^2.0.0
    * @vuecs/design bumped from ^0.0.0 to ^1.0.0
    * @vuecs/elements bumped from ^0.0.0 to ^1.0.0
    * @vuecs/forms bumped from ^3.0.0 to ^4.0.0
    * @vuecs/gravatar bumped from ^1.0.2 to ^2.0.0
    * @vuecs/icon bumped from ^0.0.0 to ^1.0.0
    * @vuecs/icons-font-awesome bumped from ^0.0.0 to ^1.0.0
    * @vuecs/link bumped from ^1.0.1 to ^2.0.0
    * @vuecs/list bumped from ^0.0.0 to ^1.0.0
    * @vuecs/navigation bumped from ^2.4.1 to ^3.0.0
    * @vuecs/nuxt bumped from ^0.0.0 to ^1.0.0
    * @vuecs/overlays bumped from ^0.0.0 to ^1.0.0
    * @vuecs/pagination bumped from ^1.3.1 to ^2.0.0
    * @vuecs/theme-tailwind bumped from ^0.0.0 to ^1.0.0
    * @vuecs/timeago bumped from ^1.1.2 to ^2.0.0
</details>

<details><summary>overlays: 1.0.0</summary>

## 1.0.0 (2026-05-20)


###   BREAKING CHANGES

* **overlays:** toast (id, toast) callbacks + render-fn fields + component slot ([#1571](https://github.com/tada5hi/vuecs/issues/1571))
* <VCTagList> is gone  use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast (id, toast) callbacks + render-fn fields + component slot ([#1571](https://github.com/tada5hi/vuecs/issues/1571)) ([c95d927](https://github.com/tada5hi/vuecs/commit/c95d9278a12a5b93a91ed22d7a0a6de724e89188))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>pagination: 2.0.0</summary>

## [2.0.0](https://github.com/tada5hi/vuecs/compare/pagination-v1.3.1...pagination-v2.0.0) (2026-05-20)


###   BREAKING CHANGES

* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Public api changed
* change architecture

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* demo/playground split, stepper context, structural-CSS color is& ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* drop meta prop in favor of v-bind spread ([e188248](https://github.com/tada5hi/vuecs/commit/e188248691c0c7427c7e433441ab95ef435a97ce))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* introduce @vuecs/icon + Iconify presets ([#1524](https://github.com/tada5hi/vuecs/issues/1524)) ([8a13f5d](https://github.com/tada5hi/vuecs/commit/8a13f5dc7898b6ed175ab679b0cdfd716cf513a6))
* **pagination:** swap internals to reka-ui primitives ([0a6ef55](https://github.com/tada5hi/vuecs/commit/0a6ef55ff7e980cec320e33c368516d90b5a2b4d))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/icon bumped from ^0.0.0 to ^1.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/icon bumped from ^0.0.0 to ^1.0.0
</details>

<details><summary>table: 1.0.0</summary>

## 1.0.0 (2026-05-20)


###   BREAKING CHANGES

* **table:** select-all column + shared selection machine in @vuecs/core ([#1577](https://github.com/tada5hi/vuecs/issues/1577))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))

### Features

* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** default cell renderer via accessor + formatter (plan 033 v0.2-A) ([#1572](https://github.com/tada5hi/vuecs/issues/1572)) ([6116740](https://github.com/tada5hi/vuecs/commit/61167401918d967a767e06e1ae4f43e837a1f209))
* **table:** plan 033 v0.2-B + v0.2-C + v0.2-D (auto-render, Lite, responsive) ([#1573](https://github.com/tada5hi/vuecs/issues/1573)) ([3c5c0ae](https://github.com/tada5hi/vuecs/commit/3c5c0ae9bd397af61b12db7a2c3f333727489a70))
* **table:** row selection v-model + ARIA grid (plan 033 v1.x-A) ([#1574](https://github.com/tada5hi/vuecs/issues/1574)) ([f9aab3e](https://github.com/tada5hi/vuecs/commit/f9aab3e12912e3f25d5fcab74740268f6de6af5f))
* **table:** select-all column + shared selection machine in @vuecs/core ([#1577](https://github.com/tada5hi/vuecs/issues/1577)) ([9b99d59](https://github.com/tada5hi/vuecs/commit/9b99d59f415cb812ba1ebe43c25cc2124e7a5bf8))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>theme-bootstrap: 4.0.0</summary>

## [4.0.0](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v3.0.0...theme-bootstrap-v4.0.0) (2026-05-20)


###   BREAKING CHANGES

* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` ’ `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, &) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />&</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies  its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone  use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is& ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display& ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound  VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* redesign @vuecs/list-controls ’ @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **elements,theme-bootstrap:** structural CSS no longer clobbers themes ([49734ae](https://github.com/tada5hi/vuecs/commit/49734ae973a95f497d564579debe15c44288dfdf))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^0.0.0 to ^1.0.0
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/countdown bumped from ^1.0.1 to ^2.0.0
    * @vuecs/elements bumped from ^0.0.0 to ^1.0.0
    * @vuecs/forms bumped from ^3.0.0 to ^4.0.0
    * @vuecs/gravatar bumped from ^1.0.2 to ^2.0.0
    * @vuecs/list bumped from ^0.0.0 to ^1.0.0
    * @vuecs/navigation bumped from ^2.4.1 to ^3.0.0
    * @vuecs/overlays bumped from ^0.0.0 to ^1.0.0
    * @vuecs/pagination bumped from ^1.3.1 to ^2.0.0
    * @vuecs/timeago bumped from ^1.1.2 to ^2.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

<details><summary>theme-bulma: 1.0.0</summary>

## 1.0.0 (2026-05-20)


###   BREAKING CHANGES

* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` ’ `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, &) for symmetry with `useColorMode`.

### Features

* add @vuecs/theme-bulma + extend design-tokens docs ([#1535](https://github.com/tada5hi/vuecs/issues/1535)) ([9c7d79c](https://github.com/tada5hi/vuecs/commit/9c7d79c1feedd6ba75233166dc8b33db9bd1f7d0))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01& ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound  VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* per-theme example apps + shared demo views ([#1539](https://github.com/tada5hi/vuecs/issues/1539)) ([0da8c64](https://github.com/tada5hi/vuecs/commit/0da8c64f59f4d74aa4c875854c2e4045413b6502))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 7 updates ([#1564](https://github.com/tada5hi/vuecs/issues/1564)) ([d3649af](https://github.com/tada5hi/vuecs/commit/d3649afa0950eb746d84514edd6639b00eaf4800))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^0.0.0 to ^1.0.0
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/countdown bumped from ^1.0.1 to ^2.0.0
    * @vuecs/design bumped from ^0.0.0 to ^1.0.0
    * @vuecs/elements bumped from ^0.0.0 to ^1.0.0
    * @vuecs/forms bumped from ^3.0.0 to ^4.0.0
    * @vuecs/gravatar bumped from ^1.0.2 to ^2.0.0
    * @vuecs/list bumped from ^0.0.0 to ^1.0.0
    * @vuecs/navigation bumped from ^2.4.1 to ^3.0.0
    * @vuecs/overlays bumped from ^0.0.0 to ^1.0.0
    * @vuecs/pagination bumped from ^1.3.1 to ^2.0.0
    * @vuecs/timeago bumped from ^1.1.2 to ^2.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/design bumped from ^0.0.0 to ^1.0.0
</details>

<details><summary>theme-tailwind: 1.0.0</summary>

## 1.0.0 (2026-05-20)


###   BREAKING CHANGES

* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl& ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` ’ `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, &) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />&</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies  its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone  use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is& ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01& ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display& ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound  VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl& ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* redesign @vuecs/list-controls ’ @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^0.0.0 to ^1.0.0
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/countdown bumped from ^1.0.1 to ^2.0.0
    * @vuecs/design bumped from ^0.0.0 to ^1.0.0
    * @vuecs/elements bumped from ^0.0.0 to ^1.0.0
    * @vuecs/forms bumped from ^3.0.0 to ^4.0.0
    * @vuecs/gravatar bumped from ^1.0.2 to ^2.0.0
    * @vuecs/list bumped from ^0.0.0 to ^1.0.0
    * @vuecs/navigation bumped from ^2.4.1 to ^3.0.0
    * @vuecs/overlays bumped from ^0.0.0 to ^1.0.0
    * @vuecs/pagination bumped from ^1.3.1 to ^2.0.0
    * @vuecs/timeago bumped from ^1.1.2 to ^2.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
    * @vuecs/design bumped from ^0.0.0 to ^1.0.0
</details>

<details><summary>timeago: 2.0.0</summary>

## [2.0.0](https://github.com/tada5hi/vuecs/compare/timeago-v1.1.2...timeago-v2.0.0) (2026-05-20)


###   BREAKING CHANGES

* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* Replace hardcoded Tailwind palette classes across theme packages with a CSS-variable design-token layer
* change architecture

### Features

* add VitePress docs site, switch to Apache 2.0, fix library bugs ([#1512](https://github.com/tada5hi/vuecs/issues/1512)) ([9892980](https://github.com/tada5hi/vuecs/commit/989298063a1184921498e8d5932fa6c95e6abd07))
* **core:** add global behavioral defaults system ([#1507](https://github.com/tada5hi/vuecs/issues/1507)) ([b52f4e5](https://github.com/tada5hi/vuecs/commit/b52f4e5a360d2804279465ada37f3ce6522d37b4))
* **core:** add structured variant system and classes sub-object ([#1497](https://github.com/tada5hi/vuecs/issues/1497)) ([529a5bf](https://github.com/tada5hi/vuecs/commit/529a5bf2afff6874a4b952db5b2c9a4a67d72dae))
* **core:** type-safe theme slots via ThemeElements declaration merging ([#1496](https://github.com/tada5hi/vuecs/issues/1496)) ([f0571c6](https://github.com/tada5hi/vuecs/commit/f0571c69416b1322bb071bb6b3d8f2f65f723885))
* design-token layer + runtime palette switcher + Nuxt module ([#1508](https://github.com/tada5hi/vuecs/issues/1508)) ([398fb85](https://github.com/tada5hi/vuecs/commit/398fb8555b4ed16b87c3d2703bfed67e31af38fc))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* rename @vuecs/form-controls ’ @vuecs/forms, migrate to Reka pri& ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* replace store system with theme resolution engine ([#1492](https://github.com/tada5hi/vuecs/issues/1492)) ([7d586b3](https://github.com/tada5hi/vuecs/commit/7d586b3707d5210970ce0138985e3cc8210264cf))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1528](https://github.com/tada5hi/vuecs/issues/1528)) ([68d5e3b](https://github.com/tada5hi/vuecs/commit/68d5e3bbbe53d0c7f4999a989272fd93f886e0e1))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* pre-release audit batch (items 1-19) ([#1578](https://github.com/tada5hi/vuecs/issues/1578)) ([ee21e19](https://github.com/tada5hi/vuecs/commit/ee21e1958712fccdaac695ff4e3d8f79adc4a297))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
  * peerDependencies
    * @vuecs/core bumped from ^2.0.0 to ^3.0.0
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).