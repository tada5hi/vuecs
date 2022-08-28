/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import vue from 'rollup-plugin-vue';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json';


const baseConfig = {
    input: 'src/entry.ts',
    plugins: {
        replace: {
            'process.env.NODE_ENV': JSON.stringify('production'),
            preventAssignment: true,
        },
        vue: {},
        postVue: [
            resolve({
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
            }),
            commonjs(),
        ],
        babel: {
            exclude: 'node_modules/**',
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
            babelHelpers: 'bundled',
        },
    },
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
    'vue'
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
    vue: 'Vue',
};

const name = 'VueLayoutUtils';

export default [
    {
        ...baseConfig,
        input: 'src/index.ts',
        external,
        plugins: [
            replace(baseConfig.plugins.replace),
            postcss({
                extract: true,
            }),
            vue(),
            ...baseConfig.plugins.postVue,
            babel({
                ...baseConfig.plugins.babel
            })
        ],
        output: [
            {
                file: pkg.module,
                format: 'esm',
                exports: 'named',
                assetFileNames: '[name]-[hash][extname]',
            },
            {
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
                assetFileNames: '[name]-[hash][extname]',
                globals,
            }
        ]

    },
    {
        ...baseConfig,
        external,
        plugins: [
            replace(baseConfig.plugins.replace),
            postcss({
                extract: true,
            }),
            vue(baseConfig.plugins.vue),
            ...baseConfig.plugins.postVue,
            babel(baseConfig.plugins.babel),
            terser({
                output: {
                    ecma: 5,
                },
            }),
        ],
        output: [
            {
                name,
                compact: true,
                file: pkg.browser,
                format: 'esm',
                assetFileNames: '[name]-[hash][extname]',
                globals,
            },
            {
                name,
                compact: true,
                file: pkg.unpkg,
                format: 'iife',
                assetFileNames: '[name]-[hash][extname]',
                globals,
            }
        ],
    }
]
