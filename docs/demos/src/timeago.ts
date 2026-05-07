import timeago from '@vuecs/timeago';
import Timeago from '@vuecs-examples/shared/views/Timeago.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(Timeago);
installVuecs(app);
app.use(timeago);
app.mount('#app');

installIframeBridge();
