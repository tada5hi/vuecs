import forms from '@vuecs/forms';
import FormSlider from '@vuecs-examples/shared/views/FormSlider.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(FormSlider);
installVuecs(app);
app.use(forms);
app.mount('#app');

installIframeBridge();
