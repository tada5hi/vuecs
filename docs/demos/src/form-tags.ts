import forms from '@vuecs/forms';
import FormTags from '@vuecs-examples/shared/views/FormTags.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(FormTags, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(forms);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
