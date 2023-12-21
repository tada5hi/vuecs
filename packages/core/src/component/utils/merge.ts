import { isObject, merge } from 'smob';
import { isVNodeOption, mergeVNodeOption } from './vnode';

export function mergeOption<T>(key: string, target: T, source: T) : T {
    if (isVNodeOption(key)) {
        return mergeVNodeOption(key, target, source);
    }

    if (isObject(target) && isObject(source)) {
        return merge(target, source) as T;
    }

    return target ?? source;
}
