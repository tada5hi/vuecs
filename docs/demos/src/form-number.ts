import forms from '@vuecs/forms';
import FormNumber from '@vuecs-examples/shared/views/FormNumber.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(FormNumber, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(forms);
app.mount('#app');

announceVariants({ size: ['xs', 'sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
