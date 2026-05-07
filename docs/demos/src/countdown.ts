import countdown from '@vuecs/countdown';
import Countdown from '@vuecs-examples/shared/views/Countdown.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(Countdown);
installVuecs(app);
app.use(countdown);
app.mount('#app');

installIframeBridge();
