# Changelog

## [2.4.1](https://github.com/tada5hi/vuecs/compare/form-controls-v2.4.0...form-controls-v2.4.1) (2025-02-11)


### Bug Fixes

* add missing slotItems option to build output ([ab21b08](https://github.com/tada5hi/vuecs/commit/ab21b08449d29a613ffd9d3c52baf2ccc437ff60))

## [2.4.0](https://github.com/tada5hi/vuecs/compare/form-controls-v2.3.1...form-controls-v2.4.0) (2025-02-11)


### Features

* support groupAppend & groupAppend slots for form-input component ([036ce79](https://github.com/tada5hi/vuecs/commit/036ce793c6ff835deccb221b42cd70c254104abf))


### Bug Fixes

* **deps:** bump @vueuse/core in the majorprod group ([#1392](https://github.com/tada5hi/vuecs/issues/1392)) ([344bf24](https://github.com/tada5hi/vuecs/commit/344bf24f522c8177e48d68a4da06bd56460a30fa))

## [2.3.1](https://github.com/tada5hi/vuecs/compare/form-controls-v2.3.0...form-controls-v2.3.1) (2024-10-16)


### Bug Fixes

* **deps:** bump @vueuse/core from 10.11.0 to 11.0.3 ([#1222](https://github.com/tada5hi/vuecs/issues/1222)) ([a839d11](https://github.com/tada5hi/vuecs/commit/a839d11a6bf8b96c7c6a9f3b806965af73b659c7))
* **deps:** bump @vueuse/core from 11.0.3 to 11.1.0 ([#1241](https://github.com/tada5hi/vuecs/issues/1241)) ([dd21000](https://github.com/tada5hi/vuecs/commit/dd21000d07f5f4a88ea3a236dc84a873befc7c74))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^1.2.0 to ^2.0.0
  * peerDependencies
    * @vuecs/core bumped from ^1.2.0 to ^2.0.0

## [2.3.0](https://github.com/tada5hi/vuecs/compare/form-controls-v2.2.0...form-controls-v2.3.0) (2024-06-13)


### Features

* use infinity scroll for form-select-search ([eba1e1e](https://github.com/tada5hi/vuecs/commit/eba1e1e475da75d5ba436b3cd65d52886119d8f9))


### Bug Fixes

* enhance interaction with form-select-search ([cd60e8a](https://github.com/tada5hi/vuecs/commit/cd60e8a5a4441b118b655b717843447417596e47))

## [2.2.0](https://github.com/tada5hi/vuecs/compare/form-controls-v2.1.1...form-controls-v2.2.0) (2024-04-22)


### Features

* introduce validation item{Class,Tag} option ([2b7fdec](https://github.com/tada5hi/vuecs/commit/2b7fdece94cda1530c308c50440bb508e82c8cd3))
* introduce validation severity property ([ac84834](https://github.com/tada5hi/vuecs/commit/ac84834ca88608821aa3b8f45197b7ed3bb7f5f6))

## [2.1.1](https://github.com/tada5hi/vuecs/compare/form-controls-v2.1.0...form-controls-v2.1.1) (2024-04-20)


### Bug Fixes

* negating invalid option value ([f4be70a](https://github.com/tada5hi/vuecs/commit/f4be70a359216639778d46472582ad2e1a132517))
* renamed form submit property valid to invalid ([7178d41](https://github.com/tada5hi/vuecs/commit/7178d412d3acaa3e17e74fc52a8b4c5161d3520b))

## [2.1.0](https://github.com/tada5hi/vuecs/compare/form-controls-v2.0.0...form-controls-v2.1.0) (2024-04-19)


### Features

* add dirty option to indicate form has been touched ([1e67f90](https://github.com/tada5hi/vuecs/commit/1e67f90603a7203b77b1ee7740707a7d19de5136))

## [2.0.0](https://github.com/tada5hi/vuecs/compare/form-controls-v1.3.0...form-controls-v2.0.0) (2024-04-19)


### ⚠ BREAKING CHANGES

* removed validation{Result,Translator} option

### Features

* refactored validation group rendering ([cbc6db6](https://github.com/tada5hi/vuecs/commit/cbc6db655d5e909e160f575ce7e07777f1b0044c))

## [1.3.0](https://github.com/tada5hi/vuecs/compare/form-controls-v1.2.0...form-controls-v1.3.0) (2024-03-07)


### Features

* experimental form-select-search component ([62a1981](https://github.com/tada5hi/vuecs/commit/62a19816c3b204a7e42cb9d9671f99437a3b9007))
* experimental multi range form slider ([1fde444](https://github.com/tada5hi/vuecs/commit/1fde444ef6c0743f8699d6114eb8d72cca5bf565))

## [1.2.0](https://github.com/tada5hi/vuecs/compare/form-controls-v1.1.1...form-controls-v1.2.0) (2023-12-23)


### Features

* hint slot for form-group component & minor fixes ([64d25d2](https://github.com/tada5hi/vuecs/commit/64d25d2be6f0a13c3dd284ea6d4ceb790181dfb8))

## [1.1.1](https://github.com/tada5hi/vuecs/compare/form-controls-v1.1.0...form-controls-v1.1.1) (2023-12-22)


### Bug Fixes

* core package on custom export path ([44d58fd](https://github.com/tada5hi/vuecs/commit/44d58fd3ca0584575bae5cfe6e833b5dafbf8379))
* fn to apply store manager options ([41836ea](https://github.com/tada5hi/vuecs/commit/41836eae3502b5c1854eacf801d2c64f08fcd650))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^1.1.0 to ^1.2.0
  * peerDependencies
    * @vuecs/core bumped from ^1.1.0 to ^1.2.0

## [1.1.0](https://github.com/tada5hi/vuecs/compare/form-controls-v1.0.0...form-controls-v1.1.0) (2023-12-21)


### Features

* refactor and enhanced component options management ([e5edb6d](https://github.com/tada5hi/vuecs/commit/e5edb6d354a44f242a952385db85e14c1b0be223))


### Bug Fixes

* options schema for component packages ([33751f8](https://github.com/tada5hi/vuecs/commit/33751f8a0295ef821063cb3243bfa2c08a010fad))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^1.0.0 to ^1.1.0
  * peerDependencies
    * @vuecs/core bumped from ^1.0.0 to ^1.1.0

## 1.0.0 (2023-12-19)


### Features

* enhanced and simplified ref utils ([74c984e](https://github.com/tada5hi/vuecs/commit/74c984ec102a2afc8df999d44003b85e555e1c94))


### Bug Fixes

* remove copyright & trigger release ([d23f8af](https://github.com/tada5hi/vuecs/commit/d23f8afe5f3f00201017925bbd0c0e8d421aae99))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/core bumped from ^0.0.0 to ^1.0.0
  * peerDependencies
    * @vuecs/core bumped from ^0.0.0 to ^1.0.0
