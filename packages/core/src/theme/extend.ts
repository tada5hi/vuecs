import { isObject } from '../utils';
import { EXTEND_SYMBOL } from './constants';
import type { ExtendValue } from './types';

export function extend(value: string): ExtendValue {
    return {
        __extend: EXTEND_SYMBOL,
        value,
    };
}

export function isExtendValue(input: unknown): input is ExtendValue {
    return isObject(input) &&
        '__extend' in input &&
        (input as ExtendValue).__extend === EXTEND_SYMBOL;
}
