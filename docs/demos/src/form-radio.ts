import forms from '@vuecs/forms';
import { createApp } from 'vue';
import { announceVariants, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './form-radio.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(forms);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
