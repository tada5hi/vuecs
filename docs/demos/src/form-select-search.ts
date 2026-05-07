import formControls from '@vuecs/forms';
import FormSelectSearch from '@vuecs-examples/shared/views/FormSelectSearch.vue';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp(FormSelectSearch);
installVuecs(app);
app.use(formControls);
app.mount('#app');

installIframeBridge();
