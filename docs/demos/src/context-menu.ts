import overlays from '@vuecs/overlays';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './context-menu.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(overlays);
app.mount('#app');

installIframeBridge();
