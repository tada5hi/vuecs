import navigation from '@vuecs/navigation';
import { createApp } from 'vue';
import { announceVariants, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './stepper.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(navigation);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
