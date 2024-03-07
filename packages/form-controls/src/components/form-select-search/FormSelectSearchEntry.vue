<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { FormSelectOption } from '../form-select';

export default defineComponent({
    props: {
        entry: {
            type: Object as PropType<FormSelectOption>,
            required: true,
        },
        selected: {
            type: Array as PropType<FormSelectOption[]>,
        },
    },
    setup(props) {
        const active = computed(
            () => props.selected &&
                props.selected.findIndex((el) => el.id === props.entry.id) !== -1,
        );

        return {
            active,
        };
    },
});
</script>
<template>
    <slot
        name="default"
        :entry="entry"
        :active="active"
    >
        {{ entry.id }}
    </slot>
</template>
