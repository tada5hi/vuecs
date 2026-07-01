# Changelog

## [1.1.3](https://github.com/tada5hi/vuecs/compare/overlays-v1.1.2...overlays-v1.1.3) (2026-06-26)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.2.2 to ^3.3.0
  * peerDependencies
    * @vuecs/core bumped from ^3.2.2 to ^3.3.0

## [1.1.2](https://github.com/tada5hi/vuecs/compare/overlays-v1.1.1...overlays-v1.1.2) (2026-06-23)


### Bug Fixes

* build declarations under strict so polymorphic as/tag prop types survive ([#1650](https://github.com/tada5hi/vuecs/issues/1650)) ([5f6838e](https://github.com/tada5hi/vuecs/commit/5f6838e81444b219d6e2fe81217fbfd3291966d3))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.2.1 to ^3.2.2
  * peerDependencies
    * @vuecs/core bumped from ^3.2.1 to ^3.2.2

## [1.1.1](https://github.com/tada5hi/vuecs/compare/overlays-v1.1.0...overlays-v1.1.1) (2026-06-23)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 12 updates ([#1639](https://github.com/tada5hi/vuecs/issues/1639)) ([4a8386c](https://github.com/tada5hi/vuecs/commit/4a8386c855b8af460f1f2a8228eb464c502ee242))
* restore build and tests under vue 3.5.38 / reka-ui 2.10.0 bump ([#1646](https://github.com/tada5hi/vuecs/issues/1646)) ([d490404](https://github.com/tada5hi/vuecs/commit/d490404d152172b454c70475dfa996d6d445c84f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.2.0 to ^3.2.1
  * peerDependencies
    * @vuecs/core bumped from ^3.2.0 to ^3.2.1

## [1.1.0](https://github.com/tada5hi/vuecs/compare/overlays-v1.0.4...overlays-v1.1.0) (2026-06-11)


### Features

* **overlays:** first-class closePolicy on VCModalContent ([#1632](https://github.com/tada5hi/vuecs/issues/1632)) ([34ef85f](https://github.com/tada5hi/vuecs/commit/34ef85fd7d3bd040b546940705ddbf935a44c8fb))

## [1.0.4](https://github.com/tada5hi/vuecs/compare/overlays-v1.0.3...overlays-v1.0.4) (2026-06-08)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.1.2 to ^3.2.0
  * peerDependencies
    * @vuecs/core bumped from ^3.1.2 to ^3.2.0

## [1.0.3](https://github.com/tada5hi/vuecs/compare/overlays-v1.0.2...overlays-v1.0.3) (2026-06-08)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 14 updates ([#1616](https://github.com/tada5hi/vuecs/issues/1616)) ([cce3b23](https://github.com/tada5hi/vuecs/commit/cce3b2350619a4e6e30ca6c0d5fae4ca3d24d810))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.1.1 to ^3.1.2
  * peerDependencies
    * @vuecs/core bumped from ^3.1.1 to ^3.1.2

## [1.0.2](https://github.com/tada5hi/vuecs/compare/overlays-v1.0.1...overlays-v1.0.2) (2026-06-02)


### Bug Fixes

* **deps:** bump the minorandpatch group across 1 directory with 8 updates ([#1604](https://github.com/tada5hi/vuecs/issues/1604)) ([aa834bb](https://github.com/tada5hi/vuecs/commit/aa834bb90e29d9adbc43aa784ccf6e2fd958c048))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.1.0 to ^3.1.1
  * peerDependencies
    * @vuecs/core bumped from ^3.1.0 to ^3.1.1

## [1.0.1](https://github.com/tada5hi/vuecs/compare/overlays-v1.0.0...overlays-v1.0.1) (2026-05-25)


### Bug Fixes

* widen as: prop to accept components across themable components (closes [#1587](https://github.com/tada5hi/vuecs/issues/1587)) ([#1589](https://github.com/tada5hi/vuecs/issues/1589)) ([0362877](https://github.com/tada5hi/vuecs/commit/03628775b43d26c7e0226b0fc70931dbb5de1293))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0
  * peerDependencies
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0

## 1.0.0 (2026-05-20)


### ⚠ BREAKING CHANGES

* **overlays:** toast (id, toast) callbacks + render-fn fields + component slot ([#1571](https://github.com/tada5hi/vuecs/issues/1571))
* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.
* VCFormSelect's themeClass.root slot is renamed to themeClass.trigger to reflect the new compound DOM. Consumers passing themeClass={ root: ... } need to migrate to themeClass={ trigger: ... }.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* export per-component &lt;Name&gt;Props types across all packages ([#1523](https://github.com/tada5hi/vuecs/issues/1523)) ([47d43de](https://github.com/tada5hi/vuecs/commit/47d43de5dd15b41a19db4030bcfb52e91374c17a))
* migrate VCFormSelect to Reka Select primitives, theme VCFormSelectSearch ([#1527](https://github.com/tada5hi/vuecs/issues/1527)) ([7e10319](https://github.com/tada5hi/vuecs/commit/7e10319bfe6e881382e3e6f999e378ee4900a33b))
* **overlays:** add @vuecs/overlays with Modal/Popover/Tooltip/DropdownMenu/ContextMenu ([#1518](https://github.com/tada5hi/vuecs/issues/1518)) ([4c8e934](https://github.com/tada5hi/vuecs/commit/4c8e93475919871bad0ac9a4ba7913c639eb23eb))
* **overlays:** toast (id, toast) callbacks + render-fn fields + component slot ([#1571](https://github.com/tada5hi/vuecs/issues/1571)) ([c95d927](https://github.com/tada5hi/vuecs/commit/c95d9278a12a5b93a91ed22d7a0a6de724e89188))
* **overlays:** toast compound + useToast shared queue (plan 029) ([#1569](https://github.com/tada5hi/vuecs/issues/1569)) ([262e94a](https://github.com/tada5hi/vuecs/commit/262e94a69dee2c958680e303401bc41640fe66d6))
* rename @vuecs/form-controls → @vuecs/forms, migrate to Reka pri… ([#1522](https://github.com/tada5hi/vuecs/issues/1522)) ([b633851](https://github.com/tada5hi/vuecs/commit/b633851eadf022facdcd59ee933b5f2031d83b72))


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
