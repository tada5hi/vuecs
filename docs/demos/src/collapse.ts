import elements from '@vuecs/elements';
import Collapse from '@vuecs-examples/shared/views/Collapse.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Collapse, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(elements);
app.mount('#app');

announceVariants(
    { chevron: ['auto', 'none'] },
    { chevron: 'auto' },
);

installIframeBridge();
