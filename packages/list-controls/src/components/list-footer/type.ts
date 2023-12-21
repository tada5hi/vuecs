import type {
    ComponentOptionsInputValue,
    ComponentOptionsOverride,
} from '@vuecs/core';
import type { VNodeChild } from 'vue';
import type {
    ExpectListBaseOptions, ListBaseOptions, ListBaseOptionsInput, ListBaseSlotProps,
} from '../list-base';

export type ListFooterSlotProps<T, M = any> = ListBaseSlotProps<T, M>;

type Fn<T, M = any> = (props: ListFooterSlotProps<T, M>) => VNodeChild;

export type ListFooterBuildOptions<T, M = any> = ListBaseOptions<T, M> & {
    content?: VNodeChild | Fn<T, M>,
};

export type ListFooterBuildOptionsInput<T, M = any> = ListBaseOptionsInput<T, M> &
ComponentOptionsOverride<
ExpectListBaseOptions<ListFooterBuildOptions<T, M>>,
ComponentOptionsInputValue<Pick<ListFooterBuildOptions<T, M>, 'content'>
>>;
