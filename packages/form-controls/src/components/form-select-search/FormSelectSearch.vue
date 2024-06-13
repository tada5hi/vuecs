<script lang="ts">
import {
    onClickOutside, useInfiniteScroll,
} from '@vueuse/core';
import type { PropType } from 'vue';
import {
    computed,
    defineComponent, ref, toRef, watch,
} from 'vue';
import type { FormSelectOption } from '../form-select';
import FormSelectSearchEntry from './FormSelectSearchEntry.vue';

export default defineComponent({
    components: { FormSelectSearchEntry },
    props: {
        modelValue: {
            type: [String, Object, Array] as PropType<string | number | FormSelectOption | FormSelectOption[]>,
            default: '',
        },
        options: {
            type: Array as PropType<FormSelectOption[]>,
            required: true,
            default: () => [],
        },
        placeholder: {
            type: String,
            required: false,
            default: '...',
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        maxItems: {
            type: Number,
            required: false,
            default: 10,
        },
        scrollDistance: {
            type: Number,
            required: false,
            default: 10,
        },
    },
    emits: ['update:modelValue', 'change'],
    async setup(props, { emit }) {
        const listElement = ref<HTMLElement | null>(null);
        const inputElement = ref<HTMLElement | null>(null);

        const q = ref('');
        const currentIndex = ref(-1);

        const selected = ref<FormSelectOption[]>([]);

        const modelValue = toRef(props, 'modelValue');

        const reset = () => {
            if (Array.isArray(props.modelValue)) {
                selected.value = [...props.modelValue];
                return;
            }

            if (typeof props.modelValue === 'undefined' || props.modelValue === null) {
                selected.value = [];
                q.value = '';
                return;
            }

            const index = props.options.findIndex(
                (el) => el.id === props.modelValue,
            );
            if (index !== -1) {
                selected.value = [props.options[index]];
                q.value = props.options[index].value;
            } else {
                selected.value = [];
                q.value = '';
            }
        };

        reset();

        watch(modelValue, () => {
            reset();
        }, { deep: true });

        const isMulti = computed(() => Array.isArray(modelValue.value));
        const isScalar = computed(
            () => typeof modelValue.value === 'string' ||
            typeof modelValue.value === 'number' ||
            typeof modelValue.value === 'undefined' ||
            modelValue.value === null,
        );

        const items = computed(() => {
            const output : FormSelectOption[] = [];
            const pattern = new RegExp(q.value, 'ig');
            for (let i = 0; i < props.options.length; i++) {
                const option = props.options[i];

                if (!q.value || q.value.length < 1 || option.value.match(pattern)) {
                    output.push(option);
                }
            }

            return output;
        });

        const itemsLength = computed(() => items.value.length);

        const itemsDisplayed = ref<FormSelectOption[]>([]);
        const setItemsDisplayed = () => {
            itemsDisplayed.value = items.value.slice(0, props.maxItems - 1);
        };

        const showMoreItemsDisplayed = () => {
            const startIndex = itemsDisplayed.value.length - 1;
            const endIndex = Math.min(startIndex + props.scrollDistance, items.value.length);
            if (startIndex === endIndex) {
                return;
            }
            itemsDisplayed.value.push(...items.value.slice(startIndex, endIndex));
        };

        setItemsDisplayed();

        watch(itemsLength, (val, oldValue) => {
            if (val !== oldValue) {
                currentIndex.value = 0;
                setItemsDisplayed();
            }
        });

        useInfiniteScroll(listElement, () => {
            showMoreItemsDisplayed();
        }, {
            canLoadMore() {
                return itemsDisplayed.value.length < items.value.length;
            },
        });

        const isDisplayed = ref(false);

        const toggle = (option: FormSelectOption) => {
            if (isMulti.value) {
                const index = selected.value.findIndex((el) => el.id === option.id);
                if (index === -1) {
                    selected.value.push(option);
                } else {
                    selected.value.splice(index, 1);
                }

                emit('update:modelValue', selected.value);
                emit('change', selected.value);
                return;
            }

            let isBlank = false;
            const [selectedValue] = selected.value;
            if (selectedValue) {
                if (selectedValue.id === option.id) {
                    q.value = '';
                    selected.value.length = 0;
                    isBlank = true;
                } else {
                    q.value = option.value;
                    selected.value = [option];
                }
            } else {
                q.value = option.value;
                selected.value = [option];
            }

            if (!isMulti.value) {
                isDisplayed.value = false;
            }

            if (isBlank) {
                emit('update:modelValue', null);
                emit('change', null);
                return;
            }

            if (isScalar.value) {
                emit('update:modelValue', option.id);
                emit('change', option.id);
            } else {
                emit('update:modelValue', option);
                emit('change', option);
            }
        };

        const display = () => {
            if (props.disabled) return;

            isDisplayed.value = true;
        };

        const hide = () => {
            if (
                !isMulti.value &&
                selected.value.length === 1
            ) {
                q.value = selected.value[0].value;
            }

            isDisplayed.value = false;
        };

        const toggleHide = (option: FormSelectOption) => {
            isDisplayed.value = false;
            toggle(option);
        };

        onClickOutside(listElement, () => {
            hide();
        }, { ignore: [inputElement] });

        const onFocus = () => {
            q.value = '';
            display();
        };

        const onKeyUp = (ev: any) => {
            if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
                display();

                if (ev.key === 'ArrowUp') {
                    if (currentIndex.value > 0) {
                        currentIndex.value--;
                    }

                    return;
                }

                if (currentIndex.value < itemsDisplayed.value.length - 1) {
                    currentIndex.value++;
                }
            }

            if (ev.key !== 'Enter') {
                display();
            }
        };

        const onKeyDown = (ev: any) => {
            if (ev.key === 'Enter') {
                if (!isDisplayed.value) {
                    return;
                }

                if (itemsDisplayed.value.length === 1) {
                    toggleHide(itemsDisplayed.value[0]);
                    return;
                }

                if (
                    currentIndex.value >= 0 &&
                    itemsDisplayed.value[currentIndex.value]
                ) {
                    toggleHide(itemsDisplayed.value[currentIndex.value]);

                    return;
                }

                if (selected.value.length === 0) {
                    if (itemsDisplayed.value[0]) {
                        toggleHide(itemsDisplayed.value[0]);
                    }

                    return;
                }

                hide();

                return;
            }

            if (ev.key === 'Tab') {
                hide();
            }
        };

        return {
            listElement,
            inputElement,

            isMulti,
            toggle,
            toggleHide,
            currentIndex,
            q,
            items: itemsDisplayed,
            selected,
            display,
            onFocus,
            onKeyUp,
            onKeyDown,
            isDisplayed,
        };
    },
});
</script>
<template>
    <div class="form-select-search">
        <input
            ref="inputElement"
            v-model="q"
            class="form-select-search-input"
            :disabled="disabled"
            :placeholder="placeholder"
            @focus="onFocus"
            @keyup="onKeyUp"
            @keydown="onKeyDown"
        >

        <div
            v-show="isDisplayed"
            ref="listElement"
            class="form-select-search-content"
        >
            <template
                v-for="(option, index) in items"
                :key="option.id"
            >
                <FormSelectSearchEntry
                    :entry="option"
                    :selected="selected"
                >
                    <template #default="{ entry, active }">
                        <div
                            class="form-select-search-item"
                            :class="{
                                'active': active,
                                'current': index === currentIndex || (index === 0 && currentIndex === -1)
                            }"
                            @mousedown="toggle(entry)"
                        >
                            {{ entry.value }}
                        </div>
                    </template>
                </FormSelectSearchEntry>
            </template>
        </div>

        <div
            v-if="isMulti"
            class="form-select-search-selected"
        >
            <slot
                name="selected"
                :items="selected"
                :toggle="toggle"
            >
                <template
                    v-for="item in selected"
                    :key="item.id"
                >
                    {{ item.value }}
                </template>
            </slot>
        </div>
    </div>
</template>
