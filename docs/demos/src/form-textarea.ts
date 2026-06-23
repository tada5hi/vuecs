import formControls from '@vuecs/forms';
import FormTextarea from '@vuecs-examples/shared/views/FormTextarea.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(FormTextarea, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(formControls);
app.mount('#app');

announceVariants({ size: ['xs', 'sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
