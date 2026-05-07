import elements from '@vuecs/elements';
import VisuallyHidden from '@vuecs-examples/shared/views/VisuallyHidden.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(VisuallyHidden);
installVuecs(app);
app.use(elements);
app.mount('#app');

installIframeBridge();
