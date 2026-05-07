import elements from '@vuecs/elements';
import AspectRatio from '@vuecs-examples/shared/views/AspectRatio.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(AspectRatio);
installVuecs(app);
app.use(elements);
app.mount('#app');

installIframeBridge();
