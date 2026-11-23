import button from '@vuecs/button';
import elements from '@vuecs/elements';
import TableCard from '@vuecs-examples/shared/views/TableCard.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(TableCard, { ...propState.value });
    },
});

installVuecs(app);
app.use(button);
app.use(elements);
app.mount('#app');

announceProps(
    {
        searchable: {
            type: 'boolean',
            default: true,
            section: 'Behavior',
        },
        busy: {
            type: 'boolean',
            default: false,
            section: 'State',
        },
        empty: {
            type: 'boolean',
            default: false,
            label: 'no records',
            section: 'State',
        },
        aside: {
            type: 'boolean',
            default: true,
            label: '#aside',
            section: 'Slots',
        },
    },
    {
        searchable: true,
        busy: false,
        empty: false,
        aside: true,
    },
);

installIframeBridge();
