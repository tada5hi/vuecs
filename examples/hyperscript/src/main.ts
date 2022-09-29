/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { bootstrapV4, fontAwesome, setConfig } from '@vue-layout/hyperscript';
import { createApp } from 'vue';

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

setConfig({
    presets: {
        bootstrapV4,
        fontAwesome,
    },
});

createApp(App)
    .mount('#app');
