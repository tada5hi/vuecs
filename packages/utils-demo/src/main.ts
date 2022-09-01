import { createApp, toRef } from 'vue';
import Utils, { Config, Library } from '@vue-layout/utils';

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

createApp(App)
    .use(Utils, {
        library: {
            [Library.BOOTSTRAP]: {
                enabled: true,
            },
            [Library.FONT_AWESOME]: {
                enabled: true,
            },
        },
    } as Partial<Config>)
    .mount('#app');
