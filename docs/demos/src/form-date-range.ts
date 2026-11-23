import formControls from '@vuecs/forms';
import FormDateRange from '@vuecs-examples/shared/views/FormDateRange.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(FormDateRange, propState.value);
    },
});

installVuecs(app);
app.use(formControls);
app.mount('#app');

announceProps(
    {
        presets: {
            type: 'boolean',
            default: true,
            section: 'Content',
        },
        disabled: {
            type: 'boolean',
            default: false,
            section: 'State',
        },
    },
    {
        presets: true,
        disabled: false,
    },
);

installIframeBridge();
