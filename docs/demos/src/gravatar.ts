import gravatar from '@vuecs/gravatar';
import Gravatar from '@vuecs-examples/shared/views/Gravatar.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(Gravatar);
installVuecs(app);
app.use(gravatar);
app.mount('#app');

installIframeBridge();
