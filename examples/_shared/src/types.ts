import type { Component } from 'vue';

export type SharedRoute = {
    /** URL path (e.g. `/button`). Mirrors the docs site's component slug. */
    path: string;
    /** Stable route name. Match the dash-cased VC component name (e.g. `button`, `form-checkbox`). */
    name: string;
    /** Human-readable label shown in navigation. */
    label: string;
    /** Lazy-imported Vue SFC under `./views/`. */
    view: () => Promise<Component>;
};
