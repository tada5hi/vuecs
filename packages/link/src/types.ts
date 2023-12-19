type Options = {};

export type LinkProperties = {
    active?: boolean,
    disabled?: boolean,
    href?: string,
    prefetch?: boolean,
    target?: string,
    to?: string,
    [key: string]: any
};

export type LinkQueryValue = string | null;

export type LinkQuery = Record<string, LinkQueryValue | LinkQueryValue[]>;

export type {
    Options,
};
