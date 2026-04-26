import countdown from '@vuecs/countdown';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './countdown.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(countdown);
app.mount('#app');

installIframeBridge();
