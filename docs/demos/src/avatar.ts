import elements from '@vuecs/elements';
import Avatar from '@vuecs-examples/shared/views/Avatar.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Avatar, { themeVariant: variantState.value });
    },
});
installVuecs(app);
app.use(elements);
app.mount('#app');

announceVariants({ size: ['sm', 'md', 'lg'] }, { size: 'md' });

installIframeBridge();
