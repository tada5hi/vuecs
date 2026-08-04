type Options = {};

// NOTE (#1705): `LinkProperties` was removed from here. It was a second,
// hand-maintained mirror of `<VCLink>`'s prop surface — so it drifted (`query`
// shipped as a real prop and was never added to it) — and its
// `[key: string]: any` index signature made every typo compile. Use `LinkProps`
// (`./component`), derived from the `linkProps` declaration via
// `ExtractPublicPropTypes`: one source of truth, no index signature. See
// `.agents/conventions.md` → "Derived prop types over hand-written mirrors".

export type LinkQueryValue = string | null;

export type LinkQuery = Record<string, LinkQueryValue | LinkQueryValue[]>;

export type {
    Options,
};
