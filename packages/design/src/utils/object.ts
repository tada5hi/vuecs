/*
 * Local mirror of `@vuecs/core`'s `isObject` helper. Duplicated (not
 * imported from core) so `@vuecs/design` keeps Layer-0 standing — no
 * internal runtime deps, works standalone with BS / Bulma / no theme.
 *
 * Keep this in sync with `packages/core/src/utils/object.ts` if the
 * semantics ever change.
 */
export function isObject(input: unknown): input is Record<string, unknown> {
    return typeof input === 'object' &&
        input !== null &&
        !Array.isArray(input);
}
