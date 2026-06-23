import navigation from '@vuecs/navigation';
import Stepper from '@vuecs-examples/shared/views/Stepper.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Stepper, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(navigation);
app.mount('#app');

announceVariants({ size: ['xs', 'sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
