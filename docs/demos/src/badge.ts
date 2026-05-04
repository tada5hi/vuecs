import elements from '@vuecs/elements';
import { createApp } from 'vue';
import { announceProps, installIframeBridge } from './iframe-bridge';
import { installVuecs } from './shared';
import Demo from './badge.demo.vue';

const app = createApp(Demo);
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
            options: ['sm', 'md', 'lg'],
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
