import table from '@vuecs/table';
import Table from '@vuecs-examples/shared/views/Table.vue';
import { createApp, h } from 'vue';
import { announceProps, installIframeBridge, propState } from './iframe-bridge';
import { installVuecs } from './shared';

const app = createApp({
    setup() {
        return () => h(Table, propState.value);
    },
});
installVuecs(app);
app.use(table);
app.mount('#app');

announceProps(
    {
        density: {
            type: 'enum',
            default: 'normal',
            options: ['compact', 'normal', 'spacious'],
            section: 'Variant',
        },
        striped: {
            type: 'boolean',
            default: false,
            section: 'Variant',
        },
        bordered: {
            type: 'boolean',
            default: false,
            section: 'Variant',
        },
        hover: {
            type: 'boolean',
            default: true,
            section: 'Variant',
        },
        rowClickable: {
            type: 'boolean',
            default: false,
            section: 'Behavior',
        },
    },
    {
        density: 'normal',
        striped: false,
        bordered: false,
        hover: true,
        rowClickable: false,
    },
);

installIframeBridge();
