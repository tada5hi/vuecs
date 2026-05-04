import navigation from '@vuecs/navigation';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './stepper.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(navigation);
app.mount('#app');

installIframeBridge();
