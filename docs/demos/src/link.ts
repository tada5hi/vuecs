import link from '@vuecs/link';
import Link from '@vuecs-examples/shared/views/Link.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(Link);
installVuecs(app);
app.use(link);
app.mount('#app');

installIframeBridge();
