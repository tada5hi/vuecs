import elements from '@vuecs/elements';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './visually-hidden.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(elements);
app.mount('#app');

installIframeBridge();
