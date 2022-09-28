/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Preset } from '@vue-layout/core';
import { setConfig } from '@vue-layout/utils';
import { createApp } from 'vue';

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

setConfig({
    preset: {
        [Preset.BOOTSTRAP]: true,
        [Preset.FONT_AWESOME]: true,
    },
});

createApp(App)
    .mount('#app');
