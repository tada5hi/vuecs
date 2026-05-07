import forms from '@vuecs/forms';
import FormPin from '@vuecs-examples/shared/views/FormPin.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(FormPin);
installVuecs(app);
app.use(forms);
app.mount('#app');

installIframeBridge();
