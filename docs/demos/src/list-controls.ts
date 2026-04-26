import listControls from '@vuecs/list-controls';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './list-controls.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(listControls);
app.mount('#app');

installIframeBridge();
