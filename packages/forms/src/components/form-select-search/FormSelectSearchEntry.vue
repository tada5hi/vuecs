<script lang="ts">
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { FormOption } from '../../types/option';

const formSelectSearchEntryProps = {
    /** The option this row represents. */
    entry: {
        type: Object as PropType<FormOption>,
        required: true,
    },
    /** The currently-selected options — used to compute `active` state. */
    selected: { type: Array as PropType<FormOption[]> },
};

export type FormSelectSearchEntryProps = ExtractPublicPropTypes<typeof formSelectSearchEntryProps>;

export default defineComponent({
    props: formSelectSearchEntryProps,
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
