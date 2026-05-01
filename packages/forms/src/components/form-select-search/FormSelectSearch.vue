<script lang="ts">
import { useComponentTheme } from '@vuecs/core';
import type {
    ThemeClassesOverride,
    ThemeElementDefinition,
    VariantValues,
} from '@vuecs/core';
import {
    onClickOutside,
    useInfiniteScroll,
} from '@vueuse/core';
import type { AcceptableValue } from 'reka-ui';
import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
    computed,
    defineComponent,
    ref,
    toRef,
    watch,
} from 'vue';
import type { FormOption } from '../../types/option';
import FormSelectSearchEntry from './FormSelectSearchEntry.vue';

export type FormSelectSearchThemeClasses = {
    root: string;
    input: string;
    content: string;
    item: string;
    itemActive: string;
    itemCurrent: string;
    itemDescription: string;
    selected: string;
    selectedItem: string;
    selectedItemRemove: string;
};

declare module '@vuecs/core' {
    interface ThemeElements {
        formSelectSearch?: ThemeElementDefinition<FormSelectSearchThemeClasses>;
    }
}

const themeDefaults = {
    classes: {
        root: 'vc-form-select-search',
        input: 'vc-form-select-search-input',
        content: 'vc-form-select-search-content',
        item: 'vc-form-select-search-item',
        itemActive: 'active',
        itemCurrent: 'current',
        itemDescription: 'vc-form-select-search-item-description',
        selected: 'vc-form-select-search-selected',
        selectedItem: 'vc-form-select-search-selected-item',
        selectedItemRemove: 'vc-form-select-search-selected-item-remove',
    },
};

const formSelectSearchProps = {
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
    /**
     * Whether to close the dropdown after a pick. When unset:
     * - single-select closes (matches the native `<select>` mental model)
     * - multi-select stays open (so the user can pick several without re-opening)
     *
     * Set explicitly (`true` / `false`) to override the mode-default.
     */
    closeOnSelect: {
        type: Boolean as PropType<boolean | undefined>,
        default: undefined,
    },
    themeClass: {
        type: Object as PropType<ThemeClassesOverride<FormSelectSearchThemeClasses>>,
        default: undefined,
    },
    themeVariant: {
        type: Object as PropType<VariantValues>,
        default: undefined,
    },
};

export type FormSelectSearchProps = ExtractPublicPropTypes<typeof formSelectSearchProps>;

export default defineComponent({
    components: { FormSelectSearchEntry },
    props: formSelectSearchProps,
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const theme = useComponentTheme('formSelectSearch', props, themeDefaults);

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

        const itemsDisplayed = ref<FormOption[]>([]);
        const setItemsDisplayed = () => {
            itemsDisplayed.value = items.value.slice(0, props.maxItems);
        };

        const showMoreItemsDisplayed = () => {
            const startIndex = itemsDisplayed.value.length;
            const endIndex = Math.min(startIndex + props.scrollDistance, items.value.length);
            if (startIndex >= endIndex) {
                return;
            }
            itemsDisplayed.value.push(...items.value.slice(startIndex, endIndex));
        };

        setItemsDisplayed();

        // Watch the filtered set itself, not just its length — two queries can
        // return the same number of matches but different items, and the
        // length-only watcher would miss the content swap, leaving the
        // dropdown showing the previous query's results.
        watch(items, () => {
            currentIndex.value = 0;
            setItemsDisplayed();
        });

        useInfiniteScroll(listElement, () => {
            showMoreItemsDisplayed();
        }, {
            canLoadMore() {
                return itemsDisplayed.value.length < items.value.length;
            },
        });

        const isDisplayed = ref(false);

        // `closeOnSelect === undefined` falls back to the mode-default:
        // single-select closes, multi stays open.
        const shouldCloseOnSelect = () => (
            typeof props.closeOnSelect === 'boolean' ? props.closeOnSelect : !isMulti.value
        );

        const toggle = (option: FormOption) => {
            // Disabled-form semantics: a disabled control must not mutate
            // its bound value or emit change events. Mouse picks on dropdown
            // items are gated by `display()` (which short-circuits when
            // disabled), but the multi-select chip-remove buttons render
            // outside the dropdown and were still callable.
            if (props.disabled) {
                return;
            }

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

                if (shouldCloseOnSelect()) {
                    isDisplayed.value = false;
                }
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

            if (shouldCloseOnSelect()) {
                isDisplayed.value = false;
            }

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
                    toggle(itemsDisplayed.value[0]);
                    return;
                }

                if (
                    currentIndex.value >= 0 &&
                    itemsDisplayed.value[currentIndex.value]
                ) {
                    toggle(itemsDisplayed.value[currentIndex.value]);

                    return;
                }

                if (selected.value.length === 0) {
                    if (itemsDisplayed.value[0]) {
                        toggle(itemsDisplayed.value[0]);
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
            theme,
            listElement,
            inputElement,

            isMulti,
            toggle,
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
    <div :class="theme.root">
        <input
            ref="inputElement"
            v-model="q"
            :class="theme.input"
            :disabled="disabled"
            :placeholder="placeholder"
            @focus="onFocus"
            @keyup="onKeyUp"
            @keydown="onKeyDown"
        >

        <div
            v-show="isDisplayed"
            ref="listElement"
            :class="theme.content"
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
                            :class="[
                                theme.item,
                                {
                                    [theme.itemActive]: active,
                                    [theme.itemCurrent]: index === currentIndex || (index === 0 && currentIndex === -1),
                                },
                            ]"
                            @mousedown="toggle(entry)"
                        >
                            {{ entry.label }}
                            <span
                                v-if="entry.description"
                                :class="theme.itemDescription"
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
            :class="theme.selected"
        >
            <slot
                name="selected"
                :items="selected"
                :toggle="toggle"
            >
                <button
                    v-for="item in selected"
                    :key="String(item.value)"
                    type="button"
                    :class="theme.selectedItem"
                    :disabled="disabled"
                    @click="toggle(item)"
                >
                    {{ item.label }}
                    <span
                        :class="theme.selectedItemRemove"
                        aria-hidden="true"
                    >&times;</span>
                </button>
            </slot>
        </div>
    </div>
</template>
