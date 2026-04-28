<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { FormOption } from '../../types/option';

export default defineComponent({
    props: {
        entry: {
            type: Object as PropType<FormOption>,
            required: true,
        },
        selected: { type: Array as PropType<FormOption[]> },
    },
    setup(props) {
        const active = computed(
            () => props.selected &&
                props.selected.findIndex((el) => el.value === props.entry.value) !== -1,
        );

        return { active };
    },
});
</script>
<template>
    <slot
        name="default"
        :entry="entry"
        :active="active"
    >
        {{ entry.label }}
    </slot>
</template>
