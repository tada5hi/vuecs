import formControls from '@vuecs/forms';
import FormCheckbox from '@vuecs-examples/shared/views/FormCheckbox.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(FormCheckbox, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(formControls);
app.mount('#app');

announceVariants({ size: ['xs', 'sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
