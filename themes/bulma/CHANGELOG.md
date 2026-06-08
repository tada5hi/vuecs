# Changelog

## [3.0.0](https://github.com/tada5hi/vuecs/compare/theme-bulma-v2.0.0...theme-bulma-v3.0.0) (2026-06-08)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.

### Features

* add @vuecs/theme-bulma + extend design-tokens docs ([#1535](https://github.com/tada5hi/vuecs/issues/1535)) ([9c7d79c](https://github.com/tada5hi/vuecs/commit/9c7d79c1feedd6ba75233166dc8b33db9bd1f7d0))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01… ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* per-theme example apps + shared demo views ([#1539](https://github.com/tada5hi/vuecs/issues/1539)) ([0da8c64](https://github.com/tada5hi/vuecs/commit/0da8c64f59f4d74aa4c875854c2e4045413b6502))
* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** expandable rows + #expansion slot (plan 038) ([#1621](https://github.com/tada5hi/vuecs/issues/1621)) ([79904ac](https://github.com/tada5hi/vuecs/commit/79904ac20d12bcf436c372c55484e5b184e7f735))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 10 updates ([#1590](https://github.com/tada5hi/vuecs/issues/1590)) ([b027606](https://github.com/tada5hi/vuecs/commit/b0276060648b010f53bfb75f856fa344b8614172))
* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1616](https://github.com/tada5hi/vuecs/issues/1616)) ([cce3b23](https://github.com/tada5hi/vuecs/commit/cce3b2350619a4e6e30ca6c0d5fae4ca3d24d810))
* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 7 updates ([#1564](https://github.com/tada5hi/vuecs/issues/1564)) ([d3649af](https://github.com/tada5hi/vuecs/commit/d3649afa0950eb746d84514edd6639b00eaf4800))
* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1604](https://github.com/tada5hi/vuecs/issues/1604)) ([aa834bb](https://github.com/tada5hi/vuecs/commit/aa834bb90e29d9adbc43aa784ccf6e2fd958c048))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^1.0.2 to ^1.0.3
    * @vuecs/core bumped from ^3.1.1 to ^3.1.2
    * @vuecs/countdown bumped from ^2.0.2 to ^2.0.3
    * @vuecs/design bumped from ^1.0.2 to ^1.0.3
    * @vuecs/elements bumped from ^1.2.1 to ^1.2.2
    * @vuecs/forms bumped from ^5.1.0 to ^5.1.1
    * @vuecs/gravatar bumped from ^2.0.3 to ^2.0.4
    * @vuecs/list bumped from ^1.0.2 to ^1.0.3
    * @vuecs/navigation bumped from ^4.0.0 to ^4.0.1
    * @vuecs/overlays bumped from ^1.0.2 to ^1.0.3
    * @vuecs/pagination bumped from ^2.1.1 to ^2.1.2
    * @vuecs/placeholder bumped from ^1.0.2 to ^1.0.3
    * @vuecs/timeago bumped from ^2.0.2 to ^2.0.3
  * peerDependencies
    * @vuecs/core bumped from ^3.1.1 to ^3.1.2
    * @vuecs/design bumped from ^1.0.2 to ^1.0.3

## [2.0.0](https://github.com/tada5hi/vuecs/compare/theme-bulma-v1.2.0...theme-bulma-v2.0.0) (2026-06-06)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).

### Features

* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/navigation bumped from ^3.0.2 to ^4.0.0

## [1.2.0](https://github.com/tada5hi/vuecs/compare/theme-bulma-v1.1.3...theme-bulma-v1.2.0) (2026-06-04)


### Features

* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/forms bumped from ^5.0.1 to ^5.1.0

## [1.1.3](https://github.com/tada5hi/vuecs/compare/theme-bulma-v1.1.2...theme-bulma-v1.1.3) (2026-06-03)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/forms bumped from ^5.0.0 to ^5.0.1

## [1.1.2](https://github.com/tada5hi/vuecs/compare/theme-bulma-v1.1.1...theme-bulma-v1.1.2) (2026-06-02)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1604](https://github.com/tada5hi/vuecs/issues/1604)) ([aa834bb](https://github.com/tada5hi/vuecs/commit/aa834bb90e29d9adbc43aa784ccf6e2fd958c048))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^1.0.1 to ^1.0.2
    * @vuecs/core bumped from ^3.1.0 to ^3.1.1
    * @vuecs/countdown bumped from ^2.0.1 to ^2.0.2
    * @vuecs/design bumped from ^1.0.1 to ^1.0.2
    * @vuecs/elements bumped from ^1.2.0 to ^1.2.1
    * @vuecs/forms bumped from ^4.0.1 to ^5.0.0
    * @vuecs/gravatar bumped from ^2.0.2 to ^2.0.3
    * @vuecs/list bumped from ^1.0.1 to ^1.0.2
    * @vuecs/navigation bumped from ^3.0.1 to ^3.0.2
    * @vuecs/overlays bumped from ^1.0.1 to ^1.0.2
    * @vuecs/pagination bumped from ^2.1.0 to ^2.1.1
    * @vuecs/placeholder bumped from ^1.0.1 to ^1.0.2
    * @vuecs/timeago bumped from ^2.0.1 to ^2.0.2
  * peerDependencies
    * @vuecs/core bumped from ^3.1.0 to ^3.1.1
    * @vuecs/design bumped from ^1.0.1 to ^1.0.2

## [1.1.1](https://github.com/tada5hi/vuecs/compare/theme-bulma-v1.1.0...theme-bulma-v1.1.1) (2026-05-25)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 10 updates ([#1590](https://github.com/tada5hi/vuecs/issues/1590)) ([b027606](https://github.com/tada5hi/vuecs/commit/b0276060648b010f53bfb75f856fa344b8614172))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^1.0.0 to ^1.0.1
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0
    * @vuecs/countdown bumped from ^2.0.0 to ^2.0.1
    * @vuecs/design bumped from ^1.0.0 to ^1.0.1
    * @vuecs/elements bumped from ^1.1.0 to ^1.2.0
    * @vuecs/forms bumped from ^4.0.0 to ^4.0.1
    * @vuecs/gravatar bumped from ^2.0.1 to ^2.0.2
    * @vuecs/list bumped from ^1.0.0 to ^1.0.1
    * @vuecs/navigation bumped from ^3.0.0 to ^3.0.1
    * @vuecs/overlays bumped from ^1.0.0 to ^1.0.1
    * @vuecs/pagination bumped from ^2.0.0 to ^2.1.0
    * @vuecs/placeholder bumped from ^1.0.0 to ^1.0.1
    * @vuecs/timeago bumped from ^2.0.0 to ^2.0.1
  * peerDependencies
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0
    * @vuecs/design bumped from ^1.0.0 to ^1.0.1

## [1.1.0](https://github.com/tada5hi/vuecs/compare/theme-bulma-v1.0.0...theme-bulma-v1.1.0) (2026-05-20)


### Features

* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/elements bumped from ^1.0.0 to ^1.1.0
    * @vuecs/gravatar bumped from ^2.0.0 to ^2.0.1
    * @vuecs/placeholder bumped from ^0.0.0 to ^1.0.0

## 1.0.0 (2026-05-20)


### ⚠ BREAKING CHANGES

* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.

### Features

* add @vuecs/theme-bulma + extend design-tokens docs ([#1535](https://github.com/tada5hi/vuecs/issues/1535)) ([9c7d79c](https://github.com/tada5hi/vuecs/commit/9c7d79c1feedd6ba75233166dc8b33db9bd1f7d0))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01… ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
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

## Changelog
