import timeago from '@vuecs/timeago';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './timeago.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(timeago);
app.mount('#app');

installIframeBridge();
