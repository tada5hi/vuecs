import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Demo from './components/Demo.vue';
import Layout from './Layout.vue';

import './style.css';

/*
 * VitePress theme entry. The docs site itself doesn't render any
 * VC* components inline — every component demo lives in an iframe
 * (see `docs/demos/`). Each iframe is a separate document that
 * installs its own `@vuecs/*` plugins via `app.use(...)` against
 * the same `@vuecs/theme-tailwind` configuration.
 *
 * `Layout` extends VitePress's default with a palette switcher in the
 * navbar — palette is global state (see `composables/use-docs-palette`),
 * so each Demo.vue reads it and forwards via postMessage to its iframe.
 *
 * If you ever need to embed a real VC* component on a docs page
 * outside of a `<Demo name="...">`, install the relevant plugin
 * here and re-import its structural CSS in `style.css`.
 */
export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('Demo', Demo);
    },
} satisfies Theme;
