import link from '@vuecs/link';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './link.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(link);
app.mount('#app');

installIframeBridge();
