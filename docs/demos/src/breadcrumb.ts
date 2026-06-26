import navigation from '@vuecs/navigation';
import Breadcrumb from '@vuecs-examples/shared/views/Breadcrumb.vue';
import { createApp, h } from 'vue';
import { installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Breadcrumb);
    },
});
installVuecs(app);
app.use(navigation);
app.mount('#app');

installIframeBridge();
