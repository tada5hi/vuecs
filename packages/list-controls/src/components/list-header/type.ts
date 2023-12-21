import type { ComponentOptionsInputValue, ComponentOptionsOverride } from '@vuecs/core';
import type { VNodeChild } from 'vue';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListBaseSlotProps,
} from '../list-base';

export type ListHeaderSlotProps<T, M = any> = ListBaseSlotProps<T, M>;

type Fn<T, M = any> = (props: ListHeaderSlotProps<T, M>) => VNodeChild;

export type ListHeaderBuildOptions<T, M = any> = ListBaseOptions<T, M> & {
    content?: VNodeChild | Fn<T, M>,
};

export type ListHeaderBuildOptionsInput<T, M = any> = ListBaseOptionsInput<T, M> &
ComponentOptionsOverride<
ExpectListBaseOptions<ListHeaderBuildOptions<T, M>>,
ComponentOptionsInputValue<Pick<ListHeaderBuildOptions<T, M>, 'content'>
>>;
