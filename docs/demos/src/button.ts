import button from '@vuecs/button';
import formControls from '@vuecs/form-controls';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './button.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(button);
app.use(formControls);
app.mount('#app');

installIframeBridge();
