/**
 * Build script: derive a Tailwind v4 palette catalog as raw CSS for the
 * `@vuecs/design/standalone` subpath (plan 015 P3).
 *
 * Why: BS / Bulma-only consumers don't install Tailwind v4, so the
 * `--color-<palette>-*` vars that `setColorPalette()` writes against don't
 * exist for them. The standalone subpath inlines all 22 Tailwind palettes
 * × 11 shades into a plain `:root { ... }` block — runtime palette
 * switching now works without Tailwind being loaded.
 *
 * Source of truth: `node_modules/tailwindcss/theme.css` ships every
 * `--color-<palette>-<shade>: oklch(...)` literal. We read it once at
 * package build time and emit `assets/palettes.css`. The file is
 * committed so consumers never run color math at install time.
 *
 * Usage:
 *   npm run --workspace=packages/design standalone:build
 *   npm run --workspace=packages/design standalone:check  (CI guard)
 *
 * Re-run on Tailwind v4 patch / minor bumps that touch palette values.
 * The 22 palettes are hard-coded here (not imported from
 * `@vuecs/theme-tailwind`) so the design package stays free of theme
 * dependencies; if Tailwind adds a new palette and we want to expose
 * it, update both this list and `theme-tailwind`'s `TAILWIND_COLOR_PALETTES`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIR = resolve(SCRIPT_DIR, '..');
const REPO_ROOT = resolve(PACKAGE_DIR, '..', '..');
const TAILWIND_THEME_CSS = resolve(REPO_ROOT, 'node_modules', 'tailwindcss', 'theme.css');
const OUTPUT_FILE = resolve(PACKAGE_DIR, 'assets', 'palettes.css');

const TAILWIND_COLOR_PALETTES = [
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
] as const;

const COLOR_PALETTE_SHADES = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '950',
] as const;

function parseTailwindTheme(): Map<string, string> {
    const css = readFileSync(TAILWIND_THEME_CSS, 'utf8');
    const out = new Map<string, string>();
    // Match `--color-<palette>-<shade>: oklch(...)` declarations.
    const re = /--color-([a-z]+)-(\d+):\s*(oklch\([^)]+\))/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(css)) !== null) {
        const [, palette, shade, value] = match;
        out.set(`${palette}-${shade}`, value);
    }
    return out;
}

function readPackageVersion(name: string): string {
    const pkgPath = resolve(REPO_ROOT, 'node_modules', name, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version: string };
    return pkg.version;
}

function emitCss(): string {
    const tokens = parseTailwindTheme();
    const tailwindVersion = readPackageVersion('tailwindcss');

    const blocks = TAILWIND_COLOR_PALETTES.map((palette) => {
        const shadeLines = COLOR_PALETTE_SHADES.map((shade) => {
            const value = tokens.get(`${palette}-${shade}`);
            if (!value) {
                throw new Error(
                    `Missing --color-${palette}-${shade} in ${TAILWIND_THEME_CSS}. ` +
                    'Did Tailwind drop a shade or rename a palette?',
                );
            }
            return `    --color-${palette}-${shade}: ${value};`;
        }).join('\n');
        return `    /* ${palette} */\n${shadeLines}`;
    }).join('\n\n');

    return `/*!
 * @vuecs/design — Tailwind v4 palette catalog (standalone subpath)
 *
 * AUTO-GENERATED. Do not edit by hand.
 *
 * Source: tailwindcss@${tailwindVersion} → theme.css. 22 palettes × 11 shades
 * (242 OKLCH literals) emitted as plain CSS custom properties so consumers
 * who don't load Tailwind can still use \`setColorPalette()\` and reference
 * the palette tokens directly.
 *
 * Regenerate:
 *   npm run --workspace=packages/design standalone:build
 *
 * Validate (CI):
 *   npm run --workspace=packages/design standalone:check
 */
:root {
${blocks}
}
`;
}

function main(): void {
    const checkOnly = process.argv.includes('--check');
    const output = emitCss();

    if (checkOnly) {
        const existing = readFileSync(OUTPUT_FILE, 'utf8');
        if (existing !== output) {
            console.error(
                `${OUTPUT_FILE} drift detected. Re-run \`npm run --workspace=packages/design standalone:build\` and commit the result.`,
            );
            process.exit(1);
        }
        console.log('palettes.css up to date.');
        return;
    }

    writeFileSync(OUTPUT_FILE, output);
    console.log(`Wrote ${OUTPUT_FILE}`);
}

main();
