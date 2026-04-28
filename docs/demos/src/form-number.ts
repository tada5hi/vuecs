import forms from '@vuecs/forms';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './form-number.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(forms);
app.mount('#app');

installIframeBridge();
