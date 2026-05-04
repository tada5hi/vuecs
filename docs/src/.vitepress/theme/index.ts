import vuecs from '@vuecs/core';
import overlays from '@vuecs/overlays';
import tailwindTheme from '@vuecs/theme-tailwind';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Demo from './components/Demo.vue';
import Playground from './components/Playground.vue';
import Layout from './Layout.vue';

import './style.css';

/*
 * VitePress theme entry. Most component examples live in iframes (see
 * `docs/demos/`) so their CSS stays isolated from VitePress's chrome.
 *
 * The single inline vuecs component on the docs site is `<VCModal>`,
 * used by the navbar `<SettingsModal>`. We install `@vuecs/core` (with
 * theme-tailwind so the modal picks up its positioning/animation
 * classes) + `@vuecs/overlays` here. Form-controls / button packages
 * are intentionally NOT installed inline — their structural CSS would
 * leak rules into VitePress's marketing chrome (Hero, FeatureGrid).
 * The settings modal styles its inner select/button controls with
 * plain HTML + `--vc-color-*` design-token vars instead.
 */
export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.use(vuecs, { themes: [tailwindTheme()] });
        app.use(overlays);
        app.component('Demo', Demo);
        app.component('Playground', Playground);
    },
} satisfies Theme;
