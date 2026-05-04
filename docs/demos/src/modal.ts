import overlays from '@vuecs/overlays';
import { createApp } from 'vue';
import { announceVariants, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './modal.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(overlays);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg', 'xl'] }, { size: 'md' });

installIframeBridge();
