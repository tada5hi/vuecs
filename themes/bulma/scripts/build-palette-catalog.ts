/**
 * Build script: derive a Tailwind v4 palette → HSL catalog for
 * `@vuecs/theme-bulma`'s runtime palette switcher.
 *
 * Why HSL and not OKLCH: Bulma 1.0 routes per-variant theming through HSL
 * **channel** vars (`--bulma-<scale>-h/s/l`). At runtime we set those
 * channels so Bulma's auto-derivation of hover / active / shade modifiers
 * kicks in without per-variant CSS overrides — a JS-side substitute for the
 * pure-CSS decomposition that the bridge (assets/index.css) explicitly calls
 * out as impossible.
 *
 * Source of truth: `node_modules/tailwindcss/theme.css` ships every
 * `--color-<palette>-<shade>: oklch(...)` literal. We read it once at
 * package build time and convert each via `culori`. The generated
 * `src/palette-catalog.ts` is committed so consumers never run color math.
 *
 * Usage:
 *   npm run palette-catalog:build       (regenerate src/palette-catalog.ts)
 *   npm run palette-catalog:check       (assert the committed file matches)
 *
 * Re-run on Tailwind major bumps; the lossy OKLCH→HSL conversion is stable
 * within a Tailwind line.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { converter } from 'culori';
import { COLOR_PALETTE_SHADES, TAILWIND_COLOR_PALETTES } from '../src/constants';
import type { TailwindColorPaletteName } from '../src/types';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIR = resolve(SCRIPT_DIR, '..');
const REPO_ROOT = resolve(PACKAGE_DIR, '..', '..');
const TAILWIND_THEME_CSS = resolve(REPO_ROOT, 'node_modules', 'tailwindcss', 'theme.css');
const OUTPUT_FILE = resolve(PACKAGE_DIR, 'src', 'palette-catalog.ts');

type PaletteName = TailwindColorPaletteName;
type Shade = typeof COLOR_PALETTE_SHADES[number];

type Hsl = {
    h: number; 
    s: number; 
    l: number 
};

const toHsl = converter('hsl');

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

function oklchToHsl(oklchString: string): Hsl {
    const hsl = toHsl(oklchString);
    if (!hsl) {
        throw new Error(`culori failed to parse: ${oklchString}`);
    }
    // culori returns h: 0-360 (or NaN for achromatic), s/l: 0-1.
    // Bulma reads h as `<number>deg`, s/l as `<number>%`. NaN hue happens
    // for pure greys (achromatic) — collapse to 0deg; saturation will be
    // 0% so the hue value is decorative anyway.
    const h = Number.isFinite(hsl.h) ? hsl.h! : 0;
    return {
        h: round(h, 2),
        s: round((hsl.s ?? 0) * 100, 2),
        l: round((hsl.l ?? 0) * 100, 2),
    };
}

function round(value: number, digits: number): number {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}

function buildCatalog(): Record<PaletteName, Record<Shade, Hsl>> {
    const tokens = parseTailwindTheme();
    const catalog = {} as Record<PaletteName, Record<Shade, Hsl>>;

    for (const palette of TAILWIND_COLOR_PALETTES) {
        const shades = {} as Record<Shade, Hsl>;
        for (const shade of COLOR_PALETTE_SHADES) {
            const oklch = tokens.get(`${palette}-${shade}`);
            if (!oklch) {
                throw new Error(
                    `Missing --color-${palette}-${shade} in ${TAILWIND_THEME_CSS}. ` +
                    'Did Tailwind drop a shade or rename a palette?',
                );
            }
            shades[shade] = oklchToHsl(oklch);
        }
        catalog[palette] = shades;
    }

    return catalog;
}

function emitTypeScript(catalog: Record<PaletteName, Record<Shade, Hsl>>): string {
    const tailwindVersion = readPackageVersion('tailwindcss');
    const culoriVersion = readPackageVersion('culori');

    const palettes = TAILWIND_COLOR_PALETTES.map((palette) => {
        const shades = COLOR_PALETTE_SHADES.map((shade) => {
            const {
                h, 
                s, 
                l, 
            } = catalog[palette][shade];
            return `        '${shade}': { h: ${h}, s: ${s}, l: ${l} },`;
        }).join('\n');
        return `    ${palette}: {\n${shades}\n    },`;
    }).join('\n');

    return `/* eslint-disable */
/**
 * Auto-generated. Do not edit by hand.
 *
 * Source: tailwindcss@${tailwindVersion} → theme.css → OKLCH literals,
 * converted to HSL via culori@${culoriVersion}.
 *
 * Regenerate with:
 *     npm run --workspace=themes/bulma palette-catalog:build
 *
 * Validate (CI):
 *     npm run --workspace=themes/bulma palette-catalog:check
 */
import type { Hsl, TailwindColorPaletteName } from './types';

export const TAILWIND_COLOR_PALETTE_HSL: Record<
    TailwindColorPaletteName,
    Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950', Hsl>
> = {
${palettes}
};
`;
}

function readPackageVersion(name: string): string {
    const pkgPath = resolve(REPO_ROOT, 'node_modules', name, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version: string };
    return pkg.version;
}

function main(): void {
    const checkOnly = process.argv.includes('--check');
    const catalog = buildCatalog();
    const output = emitTypeScript(catalog);

    if (checkOnly) {
        const existing = readFileSync(OUTPUT_FILE, 'utf8');
        if (existing !== output) {
            console.error(
                `palette-catalog drift detected. Re-run \`npm run --workspace=themes/bulma palette-catalog:build\` and commit ${OUTPUT_FILE}.`,
            );
            process.exit(1);
        }
        console.log('palette-catalog up to date.');
        return;
    }

    writeFileSync(OUTPUT_FILE, output);
    console.log(`Wrote ${OUTPUT_FILE}`);
}

main();
