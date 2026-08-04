import { expectTypeOf, test } from 'vitest';
import type { LinkProps, LinkQuery } from '../../dist';

// Contract guard for `<VCLink>`'s public prop surface (#1705).
//
// `LinkProps` is derived from the `linkProps` declaration via
// `ExtractPublicPropTypes`, so it cannot drift from what the component
// actually accepts. It replaced a hand-maintained `LinkProperties` mirror
// that had two independent defects:
//
//   1. It listed props by hand and went stale — `query` shipped as a real
//      prop (consumed by `extendLinkWithQuery`) but never made it into the
//      type, so nothing told an author it existed.
//   2. It carried `[key: string]: any`, which made every typo compile.
//      `{ to: '/x', queries: {…} }` type-checked and then did nothing at
//      runtime. Narrowing that index to `unknown` would NOT have helped:
//      excess-property checking admits any extra key whose value is
//      assignable to the index type, and everything is assignable to
//      `unknown`. Only removing the index signature catches it.
//
// Neither defect is observable from the runtime build or the runtime specs
// — the component behaves correctly, the type just lies about it. So this
// file is the guard, and it reads from `dist` (built by `build:types`,
// which the package's `test` script runs first) because that is the
// declaration consumers actually resolve.
//
// Run under a strictNullChecks-on tsconfig (`test/tsconfig.json`, wired via
// vitest.config.ts) so the assertions don't pass vacuously.

test('LinkProps exposes every real prop, `query` included', () => {
    // The regression #1705 reports: `query` is consumed by the component but
    // was missing from the exported type.
    expectTypeOf<LinkProps>().toHaveProperty('query');
    expectTypeOf<NonNullable<LinkProps['query']>>().toEqualTypeOf<LinkQuery>();
    expectTypeOf<NonNullable<LinkProps['query']>>().not.toBeAny();

    expectTypeOf<LinkProps>().toHaveProperty('active');
    expectTypeOf<LinkProps>().toHaveProperty('disabled');
    expectTypeOf<LinkProps>().toHaveProperty('href');
    expectTypeOf<LinkProps>().toHaveProperty('prefetch');
    expectTypeOf<LinkProps>().toHaveProperty('target');
    expectTypeOf<LinkProps>().toHaveProperty('to');

    // Every prop carries a Vue-level default or is genuinely optional, so the
    // whole surface is optional — a `LinkProps` object may be built up
    // incrementally, which `@vuecs/navigation`'s `<VCNavItem>` relies on.
    // Fails to compile if any prop ever becomes required.
    const incremental: LinkProps = {};
    incremental.href = '/x';
    incremental.target = '_blank';
    void incremental;
});

test('LinkProps types each prop concretely rather than `any`', () => {
    expectTypeOf<NonNullable<LinkProps['active']>>().toEqualTypeOf<boolean>();
    expectTypeOf<NonNullable<LinkProps['disabled']>>().toEqualTypeOf<boolean>();
    expectTypeOf<NonNullable<LinkProps['prefetch']>>().toEqualTypeOf<boolean>();
    expectTypeOf<NonNullable<LinkProps['href']>>().toEqualTypeOf<string>();
    expectTypeOf<NonNullable<LinkProps['target']>>().toEqualTypeOf<string>();
    // `to` accepts a route-location object as well as a path string — the
    // component branches on `isObject(props.to)` to merge `query` into it.
    expectTypeOf<NonNullable<LinkProps['to']>>().toEqualTypeOf<string | Record<string, any>>();
});

test('LinkProps has no index signature, so typos are rejected', () => {
    // The headline defect: this used to compile because of `[key: string]: any`
    // and then silently do nothing. `@ts-expect-error` FAILS the build if the
    // error stops firing — i.e. if an index signature ever comes back.
    const typo: LinkProps = {
        to: '/x',
        // @ts-expect-error — `queries` is not a prop; the real one is `query`.
        queries: { a: '1' },
    };
    void typo;

    // A correctly-spelled `query` still compiles.
    const ok: LinkProps = {
        to: '/x',
        query: { a: '1' },
    };
    void ok;

    // Arbitrary attribute pass-through is no longer part of `LinkProps`.
    // Consumers who thread attrs alongside props intersect explicitly.
    const withAttrs: LinkProps & Record<string, unknown> = {
        to: '/x',
        'data-testid': 'nav-link',
    };
    void withAttrs;
});

test('LinkQuery declares its value shapes', () => {
    expectTypeOf<LinkQuery>().toEqualTypeOf<Record<string, string | null | (string | null)[]>>();

    // NB: this pins what the type SAYS, not what the runtime honours. Only the
    // plain-`string` arm actually round-trips today — `extendLinkWithQuery`
    // feeds values straight to `URLSearchParams`, so `null` serialises as the
    // literal `"null"` (`?a=null`) and an array comma-joins into one value
    // (`?a=x%2Cy` rather than `?a=x&a=y`). The object-`to` path doesn't share
    // that flaw — it hands the record to vue-router, which serialises arrays
    // correctly — so the two render paths currently disagree for the same
    // input. Pre-existing and out of scope for #1705 (which was about the prop
    // surface, not query encoding); fixing it needs a call on how a `null`
    // value should encode (`?a` vs `?a=`). The runtime specs deliberately
    // cover string values only, so they don't cement the broken shapes.
});
