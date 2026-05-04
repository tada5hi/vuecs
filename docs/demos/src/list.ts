import list from '@vuecs/list';
import { createApp } from 'vue';
import { announceVariants, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './list.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(list);
app.mount('#app');

announceVariants({ density: ['compact', 'normal', 'spacious'] }, { density: 'normal' });

installIframeBridge();
