import gravatar from '@vuecs/gravatar';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './gravatar.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(gravatar);
app.mount('#app');

installIframeBridge();
