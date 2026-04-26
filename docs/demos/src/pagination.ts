import pagination from '@vuecs/pagination';
import { createApp } from 'vue';
import { announceVariants, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './pagination.demo.vue';

const app = createApp(Demo);
installVuecs(app);
app.use(pagination);
app.mount('#app');

announceVariants(
    {
        variant: ['outline', 'soft', 'ghost'],
        size: ['sm', 'md', 'lg'],
    },
    { variant: 'outline', size: 'md' },
);

installIframeBridge();
