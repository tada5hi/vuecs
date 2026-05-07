import formControls from '@vuecs/forms';
import FormInput from '@vuecs-examples/shared/views/FormInput.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(FormInput, propState.value);
    },
});
installVuecs(app);
app.use(formControls);
app.mount('#app');

announceProps(
    {
        'themeVariant.size': {
            type: 'enum',
            default: 'md',
            options: ['sm', 'md', 'lg'],
            section: 'Variant',
        },
        disabled: {
            type: 'boolean', 
            default: false, 
            section: 'State', 
        },
        placeholder: {
            type: 'string', 
            default: 'Enter your email', 
            section: 'Content', 
        },
    },
    {
        'themeVariant.size': 'md',
        disabled: false,
        placeholder: 'Enter your email',
    },
);

installIframeBridge();
