import { createApp } from 'vue';
import Utils, { Config, Preset } from '@vue-layout/utils';

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

const config : Partial<Config> = {
    preset: {
        [Preset.BOOTSTRAP]: true,
        [Preset.FONT_AWESOME]: true,
    },
    component: {
        formInput: {
            label: {
                preset: {
                    [Preset.BOOTSTRAP_V5]: false,
                },
            },
        },
    },
};

createApp(App)
    .use(Utils, config)
    .mount('#app');
