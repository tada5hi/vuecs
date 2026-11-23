import forms from '@vuecs/forms';
import FormRadio from '@vuecs-examples/shared/views/FormRadio.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(FormRadio, propState.value);
    },
});

installVuecs(app);
app.use(forms);
app.mount('#app');

announceProps(
    {
        segmented: {
            type: 'boolean',
            default: false,
            section: 'Layout',
        },
        'themeVariant.size': {
            type: 'enum',
            options: ['xs', 'sm', 'md', 'lg'],
            default: 'md',
            section: 'Variant',
        },
    },
    { segmented: false, 'themeVariant.size': 'md' },
);

installIframeBridge();
