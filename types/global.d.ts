// Workspace-level ambient declarations consumed by every per-package
// `tsconfig.build.json` (via the `../../types/**/*.d.ts` glob in their
// `include` arrays). TS 6 flagged side-effect CSS imports (TS2882)
// without these.
//
// The shim deliberately covers ONLY style assets — no `*.vue` shim
// here. Vue-using packages drive their builds through `vue-tsc`, which
// has native SFC support; a shared `*.vue` shim that imports from
// `vue` would force every package that includes this file (icons,
// theme-bootstrap, …) to also resolve `vue` types, breaking isolated
// workspace builds for non-Vue packages. Per-package vue shims (see
// e.g. `packages/forms/types/vue.shim.d.ts`) handle the cases where
// a local SFC import outside vue-tsc's purview needs typing.

declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';
