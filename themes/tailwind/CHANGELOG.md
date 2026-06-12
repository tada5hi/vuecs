# Changelog

## [6.0.0](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v5.0.0...theme-tailwind-v6.0.0) (2026-06-12)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01… ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))
* redesign @vuecs/list-controls → @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** expandable rows + #expansion slot (plan 038) ([#1621](https://github.com/tada5hi/vuecs/issues/1621)) ([79904ac](https://github.com/tada5hi/vuecs/commit/79904ac20d12bcf436c372c55484e5b184e7f735))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1604](https://github.com/tada5hi/vuecs/issues/1604)) ([aa834bb](https://github.com/tada5hi/vuecs/commit/aa834bb90e29d9adbc43aa784ccf6e2fd958c048))
* **forms:** square input-group adjacent corners ([#1622](https://github.com/tada5hi/vuecs/issues/1622)) ([28245f9](https://github.com/tada5hi/vuecs/commit/28245f99791d451c1b594c0a521eb2febd0d15e3))

## [5.0.0](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v4.0.0...theme-tailwind-v5.0.0) (2026-06-11)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01… ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))
* redesign @vuecs/list-controls → @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** expandable rows + #expansion slot (plan 038) ([#1621](https://github.com/tada5hi/vuecs/issues/1621)) ([79904ac](https://github.com/tada5hi/vuecs/commit/79904ac20d12bcf436c372c55484e5b184e7f735))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1604](https://github.com/tada5hi/vuecs/issues/1604)) ([aa834bb](https://github.com/tada5hi/vuecs/commit/aa834bb90e29d9adbc43aa784ccf6e2fd958c048))
* **forms:** square input-group adjacent corners ([#1622](https://github.com/tada5hi/vuecs/issues/1622)) ([28245f9](https://github.com/tada5hi/vuecs/commit/28245f99791d451c1b594c0a521eb2febd0d15e3))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/forms bumped from ^5.2.0 to ^5.2.1
    * @vuecs/overlays bumped from ^1.0.4 to ^1.1.0

## [4.0.0](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v3.0.0...theme-tailwind-v4.0.0) (2026-06-08)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01… ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))
* redesign @vuecs/list-controls → @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** expandable rows + #expansion slot (plan 038) ([#1621](https://github.com/tada5hi/vuecs/issues/1621)) ([79904ac](https://github.com/tada5hi/vuecs/commit/79904ac20d12bcf436c372c55484e5b184e7f735))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1604](https://github.com/tada5hi/vuecs/issues/1604)) ([aa834bb](https://github.com/tada5hi/vuecs/commit/aa834bb90e29d9adbc43aa784ccf6e2fd958c048))
* **forms:** square input-group adjacent corners ([#1622](https://github.com/tada5hi/vuecs/issues/1622)) ([28245f9](https://github.com/tada5hi/vuecs/commit/28245f99791d451c1b594c0a521eb2febd0d15e3))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/button bumped from ^1.0.3 to ^1.0.4
    * @vuecs/core bumped from ^3.1.2 to ^3.2.0
    * @vuecs/countdown bumped from ^2.0.3 to ^2.0.4
    * @vuecs/design bumped from ^1.0.3 to ^1.0.4
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
    * @vuecs/design bumped from ^1.0.3 to ^1.0.4

## [3.0.0](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v2.0.0...theme-tailwind-v3.0.0) (2026-06-08)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565))
* **design:** per-theme `useColorPalette` no longer auto-wires the CSP nonce. CSP-strict consumers pass `nonce` explicitly:
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01… ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))
* redesign @vuecs/list-controls → @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
* shared usePalette + useColorMode composables in @vuecs/design ([#1514](https://github.com/tada5hi/vuecs/issues/1514)) ([d0dc920](https://github.com/tada5hi/vuecs/commit/d0dc920a96e3e048dbf28fd1513c3400d29708f4))
* **table:** client-sort + multi-column + custom comparators (plan 033 v1.x-B) ([#1575](https://github.com/tada5hi/vuecs/issues/1575)) ([1ff51f6](https://github.com/tada5hi/vuecs/commit/1ff51f6461bc0ca9791cd94a7b29b4fb447c2745))
* **table:** expandable rows + #expansion slot (plan 038) ([#1621](https://github.com/tada5hi/vuecs/issues/1621)) ([79904ac](https://github.com/tada5hi/vuecs/commit/79904ac20d12bcf436c372c55484e5b184e7f735))
* **table:** semantic-HTML compound + columns driver (plan 028) ([#1567](https://github.com/tada5hi/vuecs/issues/1567)) ([507bd6b](https://github.com/tada5hi/vuecs/commit/507bd6b9878c4c27e822b3c6e9b682bd5218b726))


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 17 updates ([#1558](https://github.com/tada5hi/vuecs/issues/1558)) ([eae87f0](https://github.com/tada5hi/vuecs/commit/eae87f0ac750f521f2d604823c7dfaffcbb680a2))
* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1604](https://github.com/tada5hi/vuecs/issues/1604)) ([aa834bb](https://github.com/tada5hi/vuecs/commit/aa834bb90e29d9adbc43aa784ccf6e2fd958c048))
* **forms:** square input-group adjacent corners ([#1622](https://github.com/tada5hi/vuecs/issues/1622)) ([28245f9](https://github.com/tada5hi/vuecs/commit/28245f99791d451c1b594c0a521eb2febd0d15e3))


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

## [2.0.0](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v1.2.0...theme-tailwind-v2.0.0) (2026-06-06)


### ⚠ BREAKING CHANGES

* **navigation:** @vuecs/navigation 3.0 removes NavigationManager and the install-time item list. install() now provides only an empty reactive registry. Each <VCNavItems> owns its items via the :resolver prop (array, sync, or async fn); navs opt into publishing via registry + registry-id, and dependent navs read another nav's state via the resolver context's registry(id).

### Features

* **navigation:** per-call-site :data prop + registry (plan 037) ([#1618](https://github.com/tada5hi/vuecs/issues/1618)) ([6476683](https://github.com/tada5hi/vuecs/commit/64766833bce92bfbac658879f34655679d400a98))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/navigation bumped from ^3.0.2 to ^4.0.0

## [1.2.0](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v1.1.3...theme-tailwind-v1.2.0) (2026-06-04)


### Features

* **forms:** propagate FormGroup severity to child inputs via context ([#1615](https://github.com/tada5hi/vuecs/issues/1615)) ([a8b6193](https://github.com/tada5hi/vuecs/commit/a8b6193e99f2263b6f40050147c37a1937e4c85f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/forms bumped from ^5.0.1 to ^5.1.0

## [1.1.3](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v1.1.2...theme-tailwind-v1.1.3) (2026-06-03)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/forms bumped from ^5.0.0 to ^5.0.1

## [1.1.2](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v1.1.1...theme-tailwind-v1.1.2) (2026-06-02)


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

## [1.1.1](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v1.1.0...theme-tailwind-v1.1.1) (2026-05-25)


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

## [1.1.0](https://github.com/tada5hi/vuecs/compare/theme-tailwind-v1.0.0...theme-tailwind-v1.1.0) (2026-05-20)


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
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559))
* palette runtime moved out of @vuecs/design into @vuecs/theme-tailwind; Nuxt palette concerns moved out of @vuecs/nuxt into the new @vuecs/theme-tailwind-nuxt module. Identifiers renamed from `palette` → `colorPalette` (`useColorPalette`, `setColorPalette`, `bindColorPalette`, `applyColorPaletteCss`, `renderColorPaletteStyles`, `ColorPaletteConfig`, `TailwindColorPaletteName`, `COLOR_PALETTE_STYLE_ELEMENT_ID`, …) for symmetry with `useColorMode`.
* **gravatar:** rendered DOM changed from <img class="vc-gravatar"> to <span class="vc-avatar"><img class="vc-avatar-image" />…</span>. Consumers styling against img.vc-gravatar need to retarget the new shape. The gravatar theme key still applies — its classes now compose onto the <VCAvatar> wrapper via extend(), so per-instance theming continues to work without changes.
* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* add composables + separate button ([#1515](https://github.com/tada5hi/vuecs/issues/1515)) ([e876b6e](https://github.com/tada5hi/vuecs/commit/e876b6ece12ffa7933ddfbdf66192865c6c01e75))
* decouple @vuecs/design from Tailwind (plan 017) ([#1536](https://github.com/tada5hi/vuecs/issues/1536)) ([f108686](https://github.com/tada5hi/vuecs/commit/f10868688e834e89f269b5931d1cfcc6478e769c))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **design,themes,nuxt:** csp nonce wiring for palette style (plan 01… ([#1549](https://github.com/tada5hi/vuecs/issues/1549)) ([b9eb1a0](https://github.com/tada5hi/vuecs/commit/b9eb1a0eb4ea87c13ecf5c9ddf0f09bd02e0a638))
* **design,themes:** generic useColorPalette dispatcher  ([#1546](https://github.com/tada5hi/vuecs/issues/1546)) ([88f6ad2](https://github.com/tada5hi/vuecs/commit/88f6ad26820a664b1ba4ebb6bf02ea07a33c15a1))
* **design:** collapse per-theme useColorPalette into @vuecs/design (plan 026) ([#1563](https://github.com/tada5hi/vuecs/issues/1563)) ([66ac3f5](https://github.com/tada5hi/vuecs/commit/66ac3f52c0ce25731ca83986a8058812e767685b))
* **design:** standalone subpath for tailwind-free consumers (plan 015 P3) ([#1555](https://github.com/tada5hi/vuecs/issues/1555)) ([31e5faa](https://github.com/tada5hi/vuecs/commit/31e5faab48a9d2f575536a1fa4f5078976f714e2))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))
* **gravatar:** compose &lt;VCAvatar&gt; from @vuecs/elements ([#1530](https://github.com/tada5hi/vuecs/issues/1530)) ([63fc3ef](https://github.com/tada5hi/vuecs/commit/63fc3ef54bd7a484c6e472ceb63ba5674e31db29))
* **list:** compound API redesign + selection v-model (plan 027) ([#1565](https://github.com/tada5hi/vuecs/issues/1565)) ([2b6c45a](https://github.com/tada5hi/vuecs/commit/2b6c45ad8ada913abcc91c05cc64501d70265ad2))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **nuxt:** collapse @vuecs/theme-tailwind-nuxt into @vuecs/nuxt (pl… ([#1559](https://github.com/tada5hi/vuecs/issues/1559)) ([9dbca23](https://github.com/tada5hi/vuecs/commit/9dbca23f65c63b216643a912f43b103e1765f478))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* redesign @vuecs/list-controls → @vuecs/list with compound API ([#1525](https://github.com/tada5hi/vuecs/issues/1525)) ([b6a44b7](https://github.com/tada5hi/vuecs/commit/b6a44b7eda357cc2b3e946da2917f1fe8975a5a8))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))
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

## Changelog
