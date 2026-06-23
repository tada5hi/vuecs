import overlays from '@vuecs/overlays';
import Popover from '@vuecs-examples/shared/views/Popover.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Popover, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(overlays);
app.mount('#app');

announceVariants({ size: ['xs', 'sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
