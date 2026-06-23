import elements from '@vuecs/elements';
import Badge from '@vuecs-examples/shared/views/Badge.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Badge, propState.value);
    },
});
installVuecs(app);
app.use(elements);
app.mount('#app');

// Showcase the full color × variant matrix in the static grid (always
// visible) and let the toolbar drive the trailing "playground" badge
// where size + variant + color flip live.
announceProps(
    {
        size: {
            type: 'enum',
            default: 'md',
            options: ['xs', 'sm', 'md', 'lg'],
            section: 'Variant',
        },
        variant: {
            type: 'enum',
            default: 'soft',
            options: ['solid', 'soft', 'outline'],
            section: 'Variant',
        },
        color: {
            type: 'enum',
            default: 'neutral',
            options: ['primary', 'neutral', 'success', 'warning', 'error', 'info'],
            section: 'Variant',
        },
    },
    {
        size: 'md',
        variant: 'soft',
        color: 'neutral',
    },
);

installIframeBridge();
