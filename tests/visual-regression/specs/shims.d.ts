// Mirrors `examples/_shared/src/shims.d.ts` so tsc can follow lazy
// `.vue` imports declared in `@vuecs-examples/shared/routes` without
// pulling Vue's full SFC tooling. The visual-regression specs never
// actually mount these components — they only read `.path` / `.name`
// from the catalog.
declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent<{}, {}, any>;
    export default component;
}
