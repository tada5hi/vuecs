import type { FormOption } from '../../types/option';

export type FormSelectSearchSelectedSlotProps = {
    items: FormOption[];
    toggle: (option: FormOption) => void;
};

export type FormSelectSearchEntrySlotProps = {
    entry: FormOption;
    active: boolean;
};
