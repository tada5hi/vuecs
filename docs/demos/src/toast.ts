import overlays from '@vuecs/overlays';
import Toast from '@vuecs-examples/shared/views/Toast.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Toast, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(overlays);
app.mount('#app');

announceVariants(
    {
        position: [
            'top-right',
            'top-left',
            'top-center',
            'bottom-right',
            'bottom-left',
            'bottom-center',
        ],
    },
    { position: 'top-right' },
);

installIframeBridge();
