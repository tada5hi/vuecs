import elements from '@vuecs/elements';
import { createApp } from 'vue';
import { announceVariants, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './avatar.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(elements);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
