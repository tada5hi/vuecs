<script lang="ts">
import {
    onClickOutside,
    useInfiniteScroll,
} from '@vueuse/core';
import type { AcceptableValue } from 'reka-ui';
import type { PropType } from 'vue';
import {
    computed,
    defineComponent,
    ref,
    toRef,
    watch,
} from 'vue';
import type { FormOption } from '../../types/option';
import FormSelectSearchEntry from './FormSelectSearchEntry.vue';

export default defineComponent({
    components: { FormSelectSearchEntry },
    props: {
        modelValue: {
            type: [String, Number, Boolean, Object, Array, null] as PropType<
                AcceptableValue | AcceptableValue[] | undefined
            >,
            default: undefined,
        },
        options: {
            type: Array as PropType<FormOption[]>,
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
    setup(props, { emit }) {
        const listElement = ref<globalThis.HTMLElement | null>(null);
        const inputElement = ref<globalThis.HTMLElement | null>(null);

        const q = ref('');
        const currentIndex = ref(-1);

        const selected = ref<FormOption[]>([]);

        const modelValue = toRef(props, 'modelValue');

        const findOption = (value: AcceptableValue): FormOption | undefined => props.options.find(
            (option) => option.value === value,
        );

        const reset = () => {
            if (Array.isArray(props.modelValue)) {
                selected.value = props.modelValue
                    .map((value) => findOption(value))
                    .filter((option): option is FormOption => option !== undefined);
                return;
            }

            if (typeof props.modelValue === 'undefined' || props.modelValue === null) {
                selected.value = [];
                q.value = '';
                return;
            }

            const found = findOption(props.modelValue);
            if (found) {
                selected.value = [found];
                q.value = found.label;
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

        const items = computed(() => {
            if (!q.value || q.value.length < 1) {
                return props.options;
            }
            const pattern = new RegExp(q.value, 'ig');
            return props.options.filter((option) => option.label.match(pattern));
        });

        const itemsLength = computed(() => items.value.length);

        const itemsDisplayed = ref<FormOption[]>([]);
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

        const toggle = (option: FormOption) => {
            if (isMulti.value) {
                const index = selected.value.findIndex((el) => el.value === option.value);
                if (index === -1) {
                    selected.value.push(option);
                } else {
                    selected.value.splice(index, 1);
                }

                const values = selected.value.map((el) => el.value);
                emit('update:modelValue', values);
                emit('change', values);
                return;
            }

            let isBlank = false;
            const [selectedValue] = selected.value;
            if (selectedValue) {
                if (selectedValue.value === option.value) {
                    q.value = '';
                    selected.value.length = 0;
                    isBlank = true;
                } else {
                    q.value = option.label;
                    selected.value = [option];
                }
            } else {
                q.value = option.label;
                selected.value = [option];
            }

            isDisplayed.value = false;

            if (isBlank) {
                emit('update:modelValue', null);
                emit('change', null);
                return;
            }

            emit('update:modelValue', option.value);
            emit('change', option.value);
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
                q.value = selected.value[0].label;
            }

            isDisplayed.value = false;
        };

        const toggleHide = (option: FormOption) => {
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

        const onKeyUp = (ev: globalThis.KeyboardEvent) => {
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

        const onKeyDown = (ev: globalThis.KeyboardEvent) => {
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
    <div class="vc-form-select-search">
        <input
            ref="inputElement"
            v-model="q"
            class="vc-form-select-search-input"
            :disabled="disabled"
            :placeholder="placeholder"
            @focus="onFocus"
            @keyup="onKeyUp"
            @keydown="onKeyDown"
        >

        <div
            v-show="isDisplayed"
            ref="listElement"
            class="vc-form-select-search-content"
        >
            <template
                v-for="(option, index) in items"
                :key="String(option.value)"
            >
                <FormSelectSearchEntry
                    :entry="option"
                    :selected="selected"
                >
                    <template #default="{ entry, active }">
                        <div
                            class="vc-form-select-search-item"
                            :class="{
                                'active': active,
                                'current': index === currentIndex || (index === 0 && currentIndex === -1)
                            }"
                            @mousedown="toggle(entry)"
                        >
                            {{ entry.label }}
                            <span
                                v-if="entry.description"
                                class="vc-form-select-search-item-description"
                            >
                                {{ entry.description }}
                            </span>
                        </div>
                    </template>
                </FormSelectSearchEntry>
            </template>
        </div>

        <div
            v-if="isMulti"
            class="vc-form-select-search-selected"
        >
            <slot
                name="selected"
                :items="selected"
                :toggle="toggle"
            >
                <template
                    v-for="item in selected"
                    :key="String(item.value)"
                >
                    {{ item.label }}
                </template>
            </slot>
        </div>
    </div>
</template>
