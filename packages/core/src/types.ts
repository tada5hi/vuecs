import type { VNodeProps } from 'vue';

export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;

export type VNodeClass = string | string[] | Record<string, boolean> | VNodeClass[];
export type VNodeProperties = VNodeProps & {
    class?: VNodeClass,
    [key: string]: any
};
