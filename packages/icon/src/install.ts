import type { App, Plugin } from 'vue';
import VCIcon from './VCIcon.vue';

export type IconPluginOptions = Record<string, never>;

export function install(app: App): void {
    app.component('VCIcon', VCIcon);
}

const plugin: Plugin<[IconPluginOptions?]> = { install };

export default plugin;
