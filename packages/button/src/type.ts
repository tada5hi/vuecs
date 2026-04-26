import type { CoreOptions } from '@vuecs/core';

export type Options = CoreOptions;

export type ButtonColor = 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonThemeClasses = {
    root: string;
    leading: string;
    trailing: string;
    label: string;
};

export type ButtonSlotProps = {
    loading: boolean;
    disabled: boolean;
};
