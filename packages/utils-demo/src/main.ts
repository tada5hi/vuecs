import { createApp, toRef } from 'vue';
import Utils, { Config, Preset } from '@vue-layout/utils';

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

createApp(App)
    .use(Utils, {
        preset: {
            [Preset.BOOTSTRAP]: {
                enabled: true,
            },
            [Preset.FONT_AWESOME]: {
                enabled: true,
            },
        },
    } as Partial<Config>)
    .mount('#app');
