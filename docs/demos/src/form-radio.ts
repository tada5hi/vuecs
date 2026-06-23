import forms from '@vuecs/forms';
import FormRadio from '@vuecs-examples/shared/views/FormRadio.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(FormRadio, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(forms);
app.mount('#app');

announceVariants({ size: ['xs', 'sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
