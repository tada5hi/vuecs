/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { MemoryStore } from '@ilingo/vuelidate/core';
import { install } from '@ilingo/vuelidate';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((ctx) => {
    ctx.vueApp.use(install, {
        store: new MemoryStore({
            data: {
                en: {
                    form: {
                        createText: 'Create',
                        updateText: 'Update',
                    },
                },
                de: {
                    form: {
                        createText: 'Erstellen',
                        updateText: 'Aktualisieren',
                    },
                },
            },
        }),
    });
});
