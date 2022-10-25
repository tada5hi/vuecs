/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { builtinModules } from 'module';
import vue from 'rollup-plugin-vue';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx', '.vue'
];

/**
 * Create a base rollup config
 * @param {Record<string,any>} pkg Imported package.json
 * @param {boolean} vuePlugin Is vue package
 * @returns {import('rollup').Options}
 */
export function createConfig({pkg, vuePlugin = false }) {
    return {
        input: 'src/index.ts',
        external: Object.keys(pkg.dependencies || {})
            .concat(Object.keys(pkg.peerDependencies || {}))
            .concat(builtinModules),
        onwarn: (warning) => {
            throw Object.assign(new Error(), warning);
        },
        strictDeprecations: true,
        output: [
            {
                format: 'cjs',
                file: pkg.main,
                exports: 'named',
                footer: 'module.exports = Object.assign(exports.default, exports);',
                sourcemap: true
            },
            {
                format: 'esm',
                file: pkg.module,
                exports: 'named',
                sourcemap: true
            }
        ],
        plugins: [
            // Allows node_modules resolution
            resolve({
                extensions,
            }),

            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                preventAssignment: true,
            }),
            postcss({
                extract: true,
            }),
            ...(vuePlugin ? [vue()] : []),

            // Allow bundling cjs modules. Rollup doesn't understand cjs
            commonjs(),

            // Compile TypeScript/JavaScript files
            babel({
                exclude: 'node_modules/**',
                extensions,
                babelHelpers: 'bundled',
            })
        ],
    };
}
