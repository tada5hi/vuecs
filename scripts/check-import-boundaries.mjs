#!/usr/bin/env node
/**
 * Import-boundary guard — enforces vuecs's layering invariants that are
 * otherwise only prose in `.agents/architecture.md`. Runs in CI (lint job).
 *
 * Invariants asserted:
 *   (a) Nothing under `packages/design/src` imports `@vuecs/core` at RUNTIME
 *       (`import type` / `export type` are fine — erased at build). design
 *       bridges to core purely through the `Symbol.for('VCThemeManager')`
 *       registry, never a package import.
 *   (b) The pure resolvers `packages/core/src/theme/{resolve,variant}.ts`
 *       import nothing from `'vue'` — they must stay framework-free so they
 *       are unit-testable without `createApp()`.
 *   (c) No theme package (`themes/*`) declares `vue` or an `@vuecs/*` package
 *       under `dependencies` (peer/dev only — themes are pure data).
 *   (d) `@vuecs/core` keeps `dependencies` empty (Vue is a peer dep).
 *
 * Source-level (not built-dist) checks on purpose: tsdown bundles each
 * package to a single file, which collapses the per-file purity signal.
 * Plain Node ESM + fs so no new devDependency (mirrors
 * `packages/design/scripts/build-standalone.ts`).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const violations = [];

function report(rule, detail) {
    violations.push(`[${rule}] ${detail}`);
}

function walk(dir, exts) {
    const out = [];
    for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true, recursive: true })) {
        if (!entry.isFile()) continue;
        if (exts.some((e) => entry.name.endsWith(e))) {
            // Node <22 lacks parentPath; recursive:true gives it on 22+.
            out.push(join(entry.parentPath ?? dir, entry.name));
        }
    }
    return out;
}

function readJson(rel) {
    return JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
}

// (a) design/src must not runtime-import @vuecs/core
for (const file of walk('packages/design/src', ['.ts', '.mjs', '.js'])) {
    const src = readFileSync(file, 'utf8');
    src.split('\n').forEach((line, i) => {
        if (!/from\s+['"]@vuecs\/core['"]/.test(line)) return;
        if (/\b(import|export)\s+type\b/.test(line)) return; // type-only OK
        report('a', `${file}:${i + 1} runtime import of @vuecs/core: ${line.trim()}`);
    });
}

// (b) pure resolvers must not import from 'vue'
for (const rel of ['packages/core/src/theme/resolve.ts', 'packages/core/src/theme/variant.ts']) {
    readFileSync(join(ROOT, rel), 'utf8').split('\n').forEach((line, i) => {
        if (/from\s+['"]vue['"]/.test(line)) {
            report('b', `${rel}:${i + 1} imports from 'vue': ${line.trim()}`);
        }
    });
}

// (c) theme packages carry no vue / @vuecs/* runtime dependency
for (const theme of readdirSync(join(ROOT, 'themes'), { withFileTypes: true })) {
    if (!theme.isDirectory()) continue;
    const deps = readJson(`themes/${theme.name}/package.json`).dependencies ?? {};
    for (const name of Object.keys(deps)) {
        if (name === 'vue' || name.startsWith('@vuecs/')) {
            report('c', `themes/${theme.name} declares runtime dependency "${name}" (must be peer/dev)`);
        }
    }
}

// (d) @vuecs/core has no runtime dependencies
const coreDeps = Object.keys(readJson('packages/core/package.json').dependencies ?? {});
if (coreDeps.length > 0) {
    report('d', `@vuecs/core declares runtime dependencies: ${coreDeps.join(', ')} (Vue must stay a peer dep)`);
}

if (violations.length > 0) {
    console.error(`✗ import-boundary guard: ${violations.length} violation(s)\n`);
    for (const v of violations) console.error(`  ${v}`);
    process.exit(1);
}
console.log('✓ import-boundary guard: all layering invariants hold');
