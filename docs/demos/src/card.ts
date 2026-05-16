import button from '@vuecs/button';
import elements from '@vuecs/elements';
import Card from '@vuecs-examples/shared/views/Card.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Card, propState.value);
    },
});
installVuecs(app);
app.use(elements);
app.use(button);
app.mount('#app');

// Static variant grid is always visible; the toolbar drives the
// trailing "playground" card where variant + padding + interactive
// flip live.
announceProps(
    {
        variant: {
            type: 'enum',
            default: 'outline',
            options: ['outline', 'soft', 'elevated'],
            section: 'Variant',
        },
        padding: {
            type: 'enum',
            default: 'normal',
            options: ['compact', 'normal', 'spacious'],
            section: 'Variant',
        },
        interactive: {
            type: 'boolean',
            default: false,
            section: 'Variant',
        },
    },
    {
        variant: 'outline',
        padding: 'normal',
        interactive: false,
    },
);

installIframeBridge();
