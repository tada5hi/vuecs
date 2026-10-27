/** What a `load()` / `refresh()` / `ensure()` call did — see `DataLoadOutcome`. */
export enum DataLoadStatus {
    /** This call was the latest; its result and meta are committed. */
    APPLIED = 'applied',
    /** A newer load (or an `immediate` write) took over; this call changed nothing. */
    SUPERSEDED = 'superseded',
    /** This call was the latest and its loader threw. */
    FAILED = 'failed',
    /** `ensure()` only — the held record already satisfied it; no load ran. */
    CACHED = 'cached',
}

/** What a mutator call did — see `DataMutationStatus`. */
export enum DataMutationStatus {
    /** State changed. */
    APPLIED = 'applied',
    /** A load is in flight; the mutation is replayed once it settles. */
    BUFFERED = 'buffered',
    /** Nothing changed. */
    NOOP = 'noop',
}
