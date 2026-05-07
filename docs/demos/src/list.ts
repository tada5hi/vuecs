import list from '@vuecs/list';
import List from '@vuecs-examples/shared/views/List.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(List, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(list);
app.mount('#app');

announceVariants({ density: ['compact', 'normal', 'spacious'] }, { density: 'normal' });

installIframeBridge();
