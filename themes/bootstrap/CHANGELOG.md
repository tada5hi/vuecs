# Changelog

## [7.0.2](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v7.0.1...theme-bootstrap-v7.0.2) (2026-06-23)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^1.0.4 to ^1.1.0
    * @vuecs/core bumped from ^3.2.0 to ^3.2.1
    * @vuecs/countdown bumped from ^2.0.4 to ^2.0.5
    * @vuecs/elements bumped from ^1.2.3 to ^1.2.4
    * @vuecs/forms bumped from ^5.2.1 to ^5.2.2
    * @vuecs/gravatar bumped from ^2.0.5 to ^2.0.6
    * @vuecs/list bumped from ^1.0.4 to ^1.0.5
    * @vuecs/navigation bumped from ^4.0.2 to ^4.0.3
    * @vuecs/overlays bumped from ^1.1.0 to ^1.1.1
    * @vuecs/pagination bumped from ^2.1.3 to ^2.1.4
    * @vuecs/placeholder bumped from ^1.0.4 to ^1.0.5
    * @vuecs/timeago bumped from ^2.1.0 to ^2.1.1
  * peerDependencies
    * @vuecs/core bumped from ^3.2.0 to ^3.2.1

## [7.0.1](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v7.0.0...theme-bootstrap-v7.0.1) (2026-06-11)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/forms bumped from ^5.2.0 to ^5.2.1
    * @vuecs/overlays bumped from ^1.0.4 to ^1.1.0

## [7.0.0](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v6.0.0...theme-bootstrap-v7.0.0) (2026-06-08)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))
* redesign @vuecs/list-controls → @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** expandable rows + #expansion slot (plan 038) ([#1621](https://github.com/tada5hi/vuecs/issues/1621)) ([79904ac](https://github.com/tada5hi/vuecs/commit/79904ac20d12bcf436c372c55484e5b184e7f735))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **elements,theme-bootstrap:** structural CSS no longer clobbers themes ([49734ae](https://github.com/tada5hi/vuecs/commit/49734ae973a95f497d564579debe15c44288dfdf))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^1.0.3 to ^1.0.4
    * @vuecs/core bumped from ^3.1.2 to ^3.2.0
    * @vuecs/countdown bumped from ^2.0.3 to ^2.0.4
    * @vuecs/elements bumped from ^1.2.2 to ^1.2.3
    * @vuecs/forms bumped from ^5.1.1 to ^5.2.0
    * @vuecs/gravatar bumped from ^2.0.4 to ^2.0.5
    * @vuecs/list bumped from ^1.0.3 to ^1.0.4
    * @vuecs/navigation bumped from ^4.0.1 to ^4.0.2
    * @vuecs/overlays bumped from ^1.0.3 to ^1.0.4
    * @vuecs/pagination bumped from ^2.1.2 to ^2.1.3
    * @vuecs/placeholder bumped from ^1.0.3 to ^1.0.4
    * @vuecs/timeago bumped from ^2.0.3 to ^2.1.0
  * peerDependencies
    * @vuecs/core bumped from ^3.1.2 to ^3.2.0

## [6.0.0](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v5.0.0...theme-bootstrap-v6.0.0) (2026-06-08)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))
* redesign @vuecs/list-controls → @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** expandable rows + #expansion slot (plan 038) ([#1621](https://github.com/tada5hi/vuecs/issues/1621)) ([79904ac](https://github.com/tada5hi/vuecs/commit/79904ac20d12bcf436c372c55484e5b184e7f735))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **elements,theme-bootstrap:** structural CSS no longer clobbers themes ([49734ae](https://github.com/tada5hi/vuecs/commit/49734ae973a95f497d564579debe15c44288dfdf))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^1.0.2 to ^1.0.3
    * @vuecs/core bumped from ^3.1.1 to ^3.1.2
    * @vuecs/countdown bumped from ^2.0.2 to ^2.0.3
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

## [5.0.0](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v4.2.0...theme-bootstrap-v5.0.0) (2026-06-06)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).

### Features

* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/navigation bumped from ^3.0.2 to ^4.0.0

## [4.2.0](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v4.1.3...theme-bootstrap-v4.2.0) (2026-06-04)


### Features

* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/forms bumped from ^5.0.1 to ^5.1.0

## [4.1.3](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v4.1.2...theme-bootstrap-v4.1.3) (2026-06-03)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/forms bumped from ^5.0.0 to ^5.0.1

## [4.1.2](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v4.1.1...theme-bootstrap-v4.1.2) (2026-06-02)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^1.0.1 to ^1.0.2
    * @vuecs/core bumped from ^3.1.0 to ^3.1.1
    * @vuecs/countdown bumped from ^2.0.1 to ^2.0.2
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

## [4.1.1](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v4.1.0...theme-bootstrap-v4.1.1) (2026-05-25)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^1.0.0 to ^1.0.1
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0
    * @vuecs/countdown bumped from ^2.0.0 to ^2.0.1
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

## [4.1.0](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v4.0.0...theme-bootstrap-v4.1.0) (2026-05-20)


### Features

* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/elements bumped from ^1.0.0 to ^1.1.0
    * @vuecs/gravatar bumped from ^2.0.0 to ^2.0.1
    * @vuecs/placeholder bumped from ^0.0.0 to ^1.0.0

## [4.0.0](https://github.com/tada5hi/vuecs/compare/theme-bootstrap-v3.0.0...theme-bootstrap-v4.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* redesign @vuecs/list-controls → @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
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

## [2.0.1](https://github.com/tada5hi/vuecs/compare/preset-bootstrap-v5-v2.0.0...preset-bootstrap-v5-v2.0.1) (2026-02-18)


### Bug Fixes

* **deps:** bump (dev-)dependencies ([31acd65](https://github.com/tada5hi/vuecs/commit/31acd654d3c14eeba8edae6d889c5c3c48b85f63))

## [2.0.0](https://github.com/tada5hi/vuecs/compare/preset-bootstrap-v5-v1.1.0...preset-bootstrap-v5-v2.0.0) (2024-10-16)


### ⚠ BREAKING CHANGES

* public api changed

### Features

* custom prefix for list-control css classes ([e0b3817](https://github.com/tada5hi/vuecs/commit/e0b38173afb9b5f1f67241d897b9216c8ab2d3fc))
* provide pick-components-options helper ([e4d40b0](https://github.com/tada5hi/vuecs/commit/e4d40b0d32cd57cfda12da44fe30e11f6952f0c8))
* refactored and optimized navigation package ([#1281](https://github.com/tada5hi/vuecs/issues/1281)) ([271d80e](https://github.com/tada5hi/vuecs/commit/271d80e379fbeb5e587dc827769eeed6ddee4242))

## [1.1.0](https://github.com/tada5hi/vuecs/compare/preset-bootstrap-v5-v1.0.0...preset-bootstrap-v5-v1.1.0) (2024-04-22)


### Features

* introduce validation item{Class,Tag} option ([2b7fdec](https://github.com/tada5hi/vuecs/commit/2b7fdece94cda1530c308c50440bb508e82c8cd3))
* introduce validation severity property ([ac84834](https://github.com/tada5hi/vuecs/commit/ac84834ca88608821aa3b8f45197b7ed3bb7f5f6))

## 1.0.0 (2023-12-19)


### Features

* **pagination:** add default styling + provide utilities ([df7e4c5](https://github.com/tada5hi/vuecs/commit/df7e4c5b29417ea802c0cc049a67d96859ec4621))


### Bug Fixes

* remove copyright & trigger release ([d23f8af](https://github.com/tada5hi/vuecs/commit/d23f8afe5f3f00201017925bbd0c0e8d421aae99))
