import type { OptionsInputValue, OptionsOverride } from '@vuecs/core';
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
OptionsOverride<
ExpectListBaseOptions<ListHeaderBuildOptions<T, M>>,
OptionsInputValue<Pick<ListHeaderBuildOptions<T, M>, 'content'>
>>;
