import type { FormOption, FormOptionGroup } from './types';
import type { AcceptableValue } from 'reka-ui';

/** Type guard for narrowing in render code. */
export const isFormOptionGroup = <T extends AcceptableValue>(
    item: FormOption<T> | FormOptionGroup<T>,
): item is FormOptionGroup<T> => Array.isArray((item as FormOptionGroup<T>).options);
