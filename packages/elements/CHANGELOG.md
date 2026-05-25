# Changelog

## [1.2.0](https://github.com/tada5hi/vuecs/compare/elements-v1.1.0...elements-v1.2.0) (2026-05-25)


### Features

* **core:** port VCPrimitive into @vuecs/core, adopt in Card compound ([#1586](https://github.com/tada5hi/vuecs/issues/1586)) ([7e2b86f](https://github.com/tada5hi/vuecs/commit/7e2b86fc96391a09e8f74ce4e207ee31645654d2))


### Bug Fixes

* widen as: prop to accept components across themable components (closes [#1587](https://github.com/tada5hi/vuecs/issues/1587)) ([#1589](https://github.com/tada5hi/vuecs/issues/1589)) ([0362877](https://github.com/tada5hi/vuecs/commit/03628775b43d26c7e0226b0fc70931dbb5de1293))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0
    * @vuecs/placeholder bumped from ^1.0.0 to ^1.0.1
  * peerDependencies
    * @vuecs/core bumped from ^3.0.0 to ^3.1.0
    * @vuecs/placeholder bumped from ^1.0.0 to ^1.0.1

## [1.1.0](https://github.com/tada5hi/vuecs/compare/elements-v1.0.0...elements-v1.1.0) (2026-05-20)


### Features

* **placeholder:** add @vuecs/placeholder skeleton loading package (closes [#1476](https://github.com/tada5hi/vuecs/issues/1476)) ([#1583](https://github.com/tada5hi/vuecs/issues/1583)) ([965facf](https://github.com/tada5hi/vuecs/commit/965facf33489176bfc6ab89e0d3e288cc4c5f7ee))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/placeholder bumped from ^0.0.0 to ^1.0.0
  * peerDependencies
    * @vuecs/placeholder bumped from ^0.0.0 to ^1.0.0

## 1.0.0 (2026-05-20)


### ⚠ BREAKING CHANGES

* <VCTagList> is gone — use <VCTags>. The package is unreleased so no compat shim ships.

### Features

* add @vuecs/elements + &lt;VCHoverCard&gt; + <VCStepper> (plan 013) ([#1529](https://github.com/tada5hi/vuecs/issues/1529)) ([4df0db1](https://github.com/tada5hi/vuecs/commit/4df0db165acb120bb74d3c7f55ec76cee69c3114))
* **core:** themable-component helpers + build-themable-component guide ([#1545](https://github.com/tada5hi/vuecs/issues/1545)) ([5535158](https://github.com/tada5hi/vuecs/commit/553515865b283393a03a4be9b10d0474b673eef1))
* demo/playground split, stepper context, structural-CSS color is… ([#1533](https://github.com/tada5hi/vuecs/issues/1533)) ([4f3b053](https://github.com/tada5hi/vuecs/commit/4f3b0532c5bf334f5d50dd56c0d18d9eb2447fc7))
* **elements,gravatar:** semantic size variant on &lt;VCAvatar&gt;, display… ([#1532](https://github.com/tada5hi/vuecs/issues/1532)) ([bf5f61a](https://github.com/tada5hi/vuecs/commit/bf5f61a213bc2f446a86dc76cc9784d9b135582a))
* **elements:** alert + collapse compounds (plans 031 + 032) ([#1570](https://github.com/tada5hi/vuecs/issues/1570)) ([b4618e2](https://github.com/tada5hi/vuecs/commit/b4618e2d2f5552d76f8bb8650f61adf704bb7fc9))
* **elements:** card compound — VCCard + Header/Title/Description/Body/Footer (plan 030) ([#1566](https://github.com/tada5hi/vuecs/issues/1566)) ([53f242a](https://github.com/tada5hi/vuecs/commit/53f242ab585be7bdcb157fc522ceb4f15544ff20))


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
