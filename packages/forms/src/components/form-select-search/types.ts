import type { FormOption } from '../../types/types';

export type FormSelectSearchSelectedSlotProps = {
    items: FormOption[];
    toggle: (option: FormOption) => void;
};

export type FormSelectSearchEntrySlotProps = {
    entry: FormOption;
    active: boolean;
};
