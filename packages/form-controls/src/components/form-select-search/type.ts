import type { FormSelectOption } from '../form-select';

export type FormSelectSearchSelectedSlotProps = {
    items: FormSelectOption[];
    toggle: (option: FormSelectOption) => void;
};

export type FormSelectSearchEntrySlotProps = {
    entry: FormSelectOption;
    active: boolean;
};
