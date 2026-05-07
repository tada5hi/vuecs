import formControls from '@vuecs/forms';
import FormSelectSearchMultiple from '@vuecs-examples/shared/views/FormSelectSearchMultiple.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(FormSelectSearchMultiple);
installVuecs(app);
app.use(formControls);
app.mount('#app');

installIframeBridge();
