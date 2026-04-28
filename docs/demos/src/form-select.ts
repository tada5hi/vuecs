import formControls from '@vuecs/forms';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './form-select.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(formControls);
app.mount('#app');

installIframeBridge();
