# @vuecs/navigation

[![npm version](https://badge.fury.io/js/@vuecs%2Fnavigation.svg)](https://badge.fury.io/js/@vuecs%2Fnavigation)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Multi-level navigation for Vue 3 with optional `vue-router` integration. Every `<VCNavItems>` owns its items via a `:data` prop; navs opt into publishing to / reading from a shared reactive registry for dependent layouts (e.g. header → sidebar). Also ships `<VCStepper>` (built on Reka's `StepperRoot`) for multi-step wizards / checkout / onboarding flows.

Full documentation:

- [Navigation component](https://vuecs.dev/components/navigation)
- [Navigation guide](https://vuecs.dev/guide/navigation)
- [Stepper component](https://vuecs.dev/components/stepper)

```bash
npm install @vuecs/navigation
```

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
