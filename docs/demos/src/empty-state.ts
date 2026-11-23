import elements from '@vuecs/elements';
import type { EmptyStateVariant } from '@vuecs/elements';
import EmptyState from '@vuecs-examples/shared/views/EmptyState.vue';
import { createApp, h } from 'vue';
import { announceVariants, installIframeBridge, variantState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(EmptyState, { variant: variantState.value.variant as EmptyStateVariant | undefined });
    },
});

installVuecs(app);
app.use(elements);
app.mount('#app');

announceVariants(
    { variant: ['empty', 'noResults'] },
    { variant: 'empty' },
);

installIframeBridge();
