import pagination from '@vuecs/pagination';
import { createApp } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './pagination.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(pagination);
app.mount('#app');

installIframeBridge();
