#!/usr/bin/env node
/**
 * Exports/publish validation gate — runs `publint` over every publishable
 * `@vuecs/*` package (packages / themes / icons; `private` ones skipped).
 * Catches the real drift class on an intricate subpath surface: a path
 * declared in `exports` but missing from the published `files`, a `.d.ts`
 * or `.mjs` that doesn't exist, a bad condition order, etc.
 *
 * Fails CI on publint **errors** only; warnings are printed but non-fatal,
 * suggestions (e.g. the cosmetic `git+` repository URL) are suppressed.
 *
 * Run AFTER `npm run build` — publint inspects the built `dist`.
 *
 * `@arethetypeswrong/cli` (attw) is intentionally NOT gated here: it reports
 * "resolution failed" for every CSS-only subpath (`@vuecs/design/standalone`,
 * `*.css`), which is a false-positive class for this CSS-shipping library.
 * Run it manually when touching the types surface:
 *   npx attw --pack packages/<name> --profile esm-only
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publint } from 'publint';
import { formatMessage } from 'publint/utils';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const GROUPS = ['packages', 'themes', 'icons'];

function publishablePackages() {
    const found = [];
    for (const group of GROUPS) {
        for (const entry of readdirSync(join(ROOT, group), { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            const dir = join(ROOT, group, entry.name);
            let pkg;
            try {
                pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
            } catch {
                continue;
            }
            if (pkg.private) continue;
            found.push({ dir, pkg });
        }
    }
    return found;
}

let errorCount = 0;
for (const { dir, pkg } of publishablePackages()) {
    const { messages } = await publint({ pkgDir: dir, level: 'warning' });
    if (messages.length === 0) continue;

    console.log(`\n${pkg.name}`);
    for (const message of messages) {
        const formatted = formatMessage(message, pkg);
        if (formatted) console.log(`  [${message.type}] ${formatted}`);
        if (message.type === 'error') errorCount += 1;
    }
}

if (errorCount > 0) {
    console.error(`\n✗ publint: ${errorCount} error(s) across publishable packages`);
    process.exit(1);
}
console.log('✓ publint: no errors across publishable packages');
