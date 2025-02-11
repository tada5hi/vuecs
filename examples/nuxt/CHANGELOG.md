# Changelog

## [3.3.4](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v3.3.3...examples-nuxt-v3.3.4) (2025-02-11)


### Bug Fixes

* pass class/tag to group append/prepend slot ([c930c49](https://github.com/tada5hi/vuecs/commit/c930c49f6ca451678f958f5504b51e3de3f8ae6f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^2.4.1 to ^2.4.2

## [3.3.3](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v3.3.2...examples-nuxt-v3.3.3) (2025-02-11)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^2.4.0 to ^2.4.1

## [3.3.2](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v3.3.1...examples-nuxt-v3.3.2) (2025-02-11)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^2.3.1 to ^2.4.0

## [3.3.1](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v3.3.0...examples-nuxt-v3.3.1) (2024-10-24)


### Bug Fixes

* remove root link identification ([2568ea2](https://github.com/tada5hi/vuecs/commit/2568ea2d6234a5080f75432439c29df1494aa327))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/navigation bumped from ^2.3.0 to ^2.3.1

## [3.3.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v3.2.0...examples-nuxt-v3.3.0) (2024-10-23)


### Features

* extend navigation-item type with generic argument ([3c1c081](https://github.com/tada5hi/vuecs/commit/3c1c0816f75a21762dfc8a03f50f962ad4f97616))
* **pagination:** jump button for first & last page ([528a7be](https://github.com/tada5hi/vuecs/commit/528a7be78d3a8e9fa6e26814184d62d32a994a6f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/navigation bumped from ^2.2.0 to ^2.3.0
    * @vuecs/pagination bumped from ^1.2.0 to ^1.3.0
    * @vuecs/preset-font-awesome bumped from ^1.0.0 to ^1.1.0

## [3.2.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v3.1.0...examples-nuxt-v3.2.0) (2024-10-17)


### Features

* enhance preset css and reorder navigation link elements ([6705bed](https://github.com/tada5hi/vuecs/commit/6705bed34cf2e028e190869534ebb01d43559513))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/navigation bumped from ^2.1.0 to ^2.2.0

## [3.1.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v3.0.0...examples-nuxt-v3.1.0) (2024-10-17)


### Features

* introduce buildOnce method for navigation manager ([b3e195b](https://github.com/tada5hi/vuecs/commit/b3e195b875ee97988972e90196620f723af1e9cc))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/navigation bumped from ^2.0.0 to ^2.1.0

## [3.0.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v2.3.0...examples-nuxt-v3.0.0) (2024-10-16)


### ⚠ BREAKING CHANGES

* public api changed
* refs in list-controls no longer permitted

### Features

* css preset for list-controls ([3e7e698](https://github.com/tada5hi/vuecs/commit/3e7e698d515f0c37f811964c72222c8c14e1183c))
* custom css classes for pagination package ([32f13d2](https://github.com/tada5hi/vuecs/commit/32f13d2a9e39ae09f6d16f29cbd143f1f3118cd0))
* custom prefix for list-control css classes ([e0b3817](https://github.com/tada5hi/vuecs/commit/e0b38173afb9b5f1f67241d897b9216c8ab2d3fc))
* only allow non reactive values for list build fns ([944252e](https://github.com/tada5hi/vuecs/commit/944252e11562c7bf401faf7823446b9231ba802f))
* provide pick-components-options helper ([e4d40b0](https://github.com/tada5hi/vuecs/commit/e4d40b0d32cd57cfda12da44fe30e11f6952f0c8))
* refactored and optimized navigation package ([#1281](https://github.com/tada5hi/vuecs/issues/1281)) ([271d80e](https://github.com/tada5hi/vuecs/commit/271d80e379fbeb5e587dc827769eeed6ddee4242))


### Bug Fixes

* syntax for buildList fn ([079e727](https://github.com/tada5hi/vuecs/commit/079e72733b18568bf4471553e9ff710563f6fa9b))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^2.3.0 to ^2.3.1
    * @vuecs/list-controls bumped from ^1.1.1 to ^2.0.0
    * @vuecs/navigation bumped from ^1.1.1 to ^2.0.0
    * @vuecs/pagination bumped from ^1.1.1 to ^1.2.0
    * @vuecs/preset-bootstrap-v5 bumped from ^1.1.0 to ^2.0.0

## [2.3.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v2.2.0...examples-nuxt-v2.3.0) (2024-06-13)


### Features

* use infinity scroll for form-select-search ([eba1e1e](https://github.com/tada5hi/vuecs/commit/eba1e1e475da75d5ba436b3cd65d52886119d8f9))


### Bug Fixes

* enhance interaction with form-select-search ([cd60e8a](https://github.com/tada5hi/vuecs/commit/cd60e8a5a4441b118b655b717843447417596e47))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^2.2.0 to ^2.3.0

## [2.2.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v2.1.0...examples-nuxt-v2.2.0) (2024-04-22)


### Features

* introduce validation severity property ([ac84834](https://github.com/tada5hi/vuecs/commit/ac84834ca88608821aa3b8f45197b7ed3bb7f5f6))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^2.1.1 to ^2.2.0
    * @vuecs/preset-bootstrap-v5 bumped from ^1.0.0 to ^1.1.0

## [2.1.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v2.0.2...examples-nuxt-v2.1.0) (2024-04-21)


### Features

* refactor and optimized component & dependency management ([eb85211](https://github.com/tada5hi/vuecs/commit/eb85211b9efaa08cfde06c2ad6dc5eaca2a87fc8))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/timeago bumped from ^1.0.4 to ^1.1.0

## [2.0.2](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v2.0.1...examples-nuxt-v2.0.2) (2024-04-20)


### Bug Fixes

* renamed form submit property valid to invalid ([7178d41](https://github.com/tada5hi/vuecs/commit/7178d412d3acaa3e17e74fc52a8b4c5161d3520b))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^2.1.0 to ^2.1.1

## [2.0.1](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v2.0.0...examples-nuxt-v2.0.1) (2024-04-19)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^2.0.0 to ^2.1.0

## [2.0.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v1.2.0...examples-nuxt-v2.0.0) (2024-04-19)


### ⚠ BREAKING CHANGES

* removed validation{Result,Translator} option

### Features

* refactored validation group rendering ([cbc6db6](https://github.com/tada5hi/vuecs/commit/cbc6db655d5e909e160f575ce7e07777f1b0044c))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^1.3.0 to ^2.0.0
    * @vuecs/timeago bumped from ^1.0.3 to ^1.0.4

## [1.2.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v1.1.0...examples-nuxt-v1.2.0) (2024-03-07)


### Features

* experimental form-select-search component ([62a1981](https://github.com/tada5hi/vuecs/commit/62a19816c3b204a7e42cb9d9671f99437a3b9007))
* experimental multi range form slider ([1fde444](https://github.com/tada5hi/vuecs/commit/1fde444ef6c0743f8699d6114eb8d72cca5bf565))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^1.2.0 to ^1.3.0
    * @vuecs/timeago bumped from ^1.0.2 to ^1.0.3

## [1.1.0](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v1.0.1...examples-nuxt-v1.1.0) (2023-12-23)


### Features

* hint slot for form-group component & minor fixes ([64d25d2](https://github.com/tada5hi/vuecs/commit/64d25d2be6f0a13c3dd284ea6d4ceb790181dfb8))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^1.1.1 to ^1.2.0

## [1.0.1](https://github.com/tada5hi/vuecs/compare/examples-nuxt-v1.0.0...examples-nuxt-v1.0.1) (2023-12-22)


### Bug Fixes

* fn to apply store manager options ([41836ea](https://github.com/tada5hi/vuecs/commit/41836eae3502b5c1854eacf801d2c64f08fcd650))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^1.1.0 to ^1.1.1
    * @vuecs/gravatar bumped from ^1.0.0 to ^1.0.1
    * @vuecs/list-controls bumped from ^1.1.0 to ^1.1.1
    * @vuecs/navigation bumped from ^1.1.0 to ^1.1.1
    * @vuecs/pagination bumped from ^1.1.0 to ^1.1.1
    * @vuecs/timeago bumped from ^1.0.1 to ^1.0.2

## 1.0.0 (2023-12-21)


### Features

* enable link to keep current query state ([4f33d18](https://github.com/tada5hi/vuecs/commit/4f33d18b9dcf5701f38ece5532b185312ebffc2c))
* enhanced and simplified ref utils ([74c984e](https://github.com/tada5hi/vuecs/commit/74c984ec102a2afc8df999d44003b85e555e1c94))
* **pagination:** add default styling + provide utilities ([df7e4c5](https://github.com/tada5hi/vuecs/commit/df7e4c5b29417ea802c0cc049a67d96859ec4621))
* refactor and enhanced component options management ([e5edb6d](https://github.com/tada5hi/vuecs/commit/e5edb6d354a44f242a952385db85e14c1b0be223))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @vuecs/form-controls bumped from ^1.0.0 to ^1.1.0
    * @vuecs/list-controls bumped from ^1.0.0 to ^1.1.0
    * @vuecs/navigation bumped from ^1.0.0 to ^1.1.0
    * @vuecs/pagination bumped from ^1.0.0 to ^1.1.0
    * @vuecs/timeago bumped from ^1.0.0 to ^1.0.1
