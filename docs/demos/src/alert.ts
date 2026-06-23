import elements from '@vuecs/elements';
import Alert from '@vuecs-examples/shared/views/Alert.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Alert, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(elements);
app.mount('#app');

announceVariants(
    {
        variant: ['solid', 'soft', 'outline'],
        size: ['xs', 'sm', 'md', 'lg'],
    },
    { variant: 'soft', size: 'md' },
);

installIframeBridge();
