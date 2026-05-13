// Workspace-level ambient declarations consumed by every per-package
// `tsconfig.build.json` (via the `../../types/**/*.d.ts` glob in their
// `include` arrays). TS 6 flagged side-effect CSS imports (TS2882)
// without these.

declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent;
    export default component;
}
