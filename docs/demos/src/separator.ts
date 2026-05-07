import elements from '@vuecs/elements';
import Separator from '@vuecs-examples/shared/views/Separator.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(Separator);
installVuecs(app);
app.use(elements);
app.mount('#app');

installIframeBridge();
