export type ObjectLiteral = Record<string, any>;

export type ListLoadFn<
    M = any,
> = (data?: M) => Promise<void> | void;
export type ListEventFn<T> = (item: T) => any;
export type ListItemKey<T> = keyof T | ((item: T) => keyof T);
export type ListItemId<T> = (item: T) => string | number;
