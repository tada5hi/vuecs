import type { OptionsInputValue, OptionsOverride } from '@vuecs/core';
import type { VNodeChild } from 'vue';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListBaseSlotProps,
} from '../list-base';

export type ListLoadingSlotProps<T, M = any> = ListBaseSlotProps<T, M>;

type Fn<T, M = any> = (props: ListLoadingSlotProps<T, M>) => VNodeChild;

export type ListLoadingBuildOptions<T, M = any> = ListBaseOptions<T, M> & {
    content?: VNodeChild | Fn<T, M>,
};

export type ListLoadingBuildOptionsInput<T, M = any> = ListBaseOptionsInput<T, M> &
OptionsOverride<
ExpectListBaseOptions<ListLoadingBuildOptions<T, M>>,
OptionsInputValue<Pick<ListLoadingBuildOptions<T, M>, 'content'>
>>;
