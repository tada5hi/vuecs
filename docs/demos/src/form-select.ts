import formControls from '@vuecs/forms';
import FormSelect from '@vuecs-examples/shared/views/FormSelect.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(FormSelect, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(formControls);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
