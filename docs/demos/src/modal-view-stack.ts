import overlays from '@vuecs/overlays';
import ModalViewStack from '@vuecs-examples/shared/views/ModalViewStack.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(ModalViewStack);
installVuecs(app);
app.use(overlays);
app.mount('#app');

installIframeBridge();
