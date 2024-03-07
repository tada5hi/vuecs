<script lang="ts">
import {
    defineComponent, onMounted, onUnmounted, ref, toRef, watch,
} from 'vue';
import { FormRangeSlider } from './module';

export default defineComponent({
    props: {
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
    },
    emits: ['change'],
    setup(props, { emit }) {
        const el = ref<HTMLElement | null>(null);
        let instance : FormRangeSlider | undefined;

        const min = toRef(props, 'min');
        const max = toRef(props, 'max');

        watch(min, (value) => {
            if (instance) {
                instance.min = value;
            }
        });

        watch(max, (value) => {
            if (instance) {
                instance.max = value;
            }
        });

        onMounted(() => {
            instance = new FormRangeSlider({
                el: el.value as HTMLElement,
                min: props.min,
                max: props.max,
            });
            instance.mount();
        });

        onUnmounted(() => {
            if (instance) {
                instance.unmount();
            }
        });

        const handleChanged = () => {
            if (!instance) return;

            emit('change', {
                min: instance.min,
                max: instance.max,
            });
        };

        return {
            el,
            handleChanged,
        };
    },
});
</script>
<template>
    <div
        ref="el"
        class="form-range-multi-slider"
        @change="handleChanged"
    >
        <div class="track">
            <div class="thumb upper" />
            <div class="thumb lower" />
            <div class="track-diff" />
        </div>
    </div>
</template>
