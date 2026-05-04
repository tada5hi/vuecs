import formControls from '@vuecs/forms';
import { createApp } from 'vue';
import { announceProps, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './form-input.demo.vue';

const app = createApp(Demo);
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
