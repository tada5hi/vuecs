import overlays from '@vuecs/overlays';
import HoverCard from '@vuecs-examples/shared/views/HoverCard.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(HoverCard, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(overlays);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
