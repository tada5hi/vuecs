# @vue-layout/hyperscript 👻

[![npm version](https://badge.fury.io/js/@vue-layout%2Fhyperscript.svg)](https://badge.fury.io/js/@vue-layout%2Fhyperscript)
[![CI](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vue-layout/actions/workflows/main.yml)

This package provides helpers for building **forms** and **list** elements on the fly, using hyperscript.
Those can be used directly in the vue render function 🔥.

It also provides presets for bootstrap & font-awesome.

> **Note**
> The package is still in development and the API is still subject to change.
> Besides, the documentation still needs to be expanded

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [License](#license)

## Installation

```
$ npm i --save @vue-layout/hyperscript
```

## Usage

The following **form** helpers are provided:

- `buildFormInput`
- `buildFormInputCheckbox`
- `buildFormInputText`
- `buildFormSelect`
- `buildFormSubmit`
- `buildFormTextarea`

The following **list** helpers are provided:

- `buildList`
- `buildListActionRefresh`
- `buildListHeader`
- `buildListItem`
- `buildListItems`
- `buildListNoMore`
- `buildListPagination`
- `buildListSearch`
- `buildListTitle`

## Example

For an implementation example, on how to use this library, check out the example
[package](https://github.com/tada5hi/vue-layout/tree/master/examples/hyperscript).

## License

Made with 💚

Published under [MIT License](./LICENSE).
