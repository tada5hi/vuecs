import overlays from '@vuecs/overlays';
import ContextMenu from '@vuecs-examples/shared/views/ContextMenu.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(ContextMenu, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(overlays);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
