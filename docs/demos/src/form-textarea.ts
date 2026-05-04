import formControls from '@vuecs/forms';
import { createApp } from 'vue';
import { announceVariants, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './form-textarea.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(formControls);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
