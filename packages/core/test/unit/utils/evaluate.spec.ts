/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { evaluateFnOrValue } from '../../../src';

describe('src/utils/evaluate', () => {
    it('should evaluate value', () => {
        const output = evaluateFnOrValue('foo');
        expect(output).toEqual('foo');
    });

    it('should evaluate fn', () => {
        const output = evaluateFnOrValue((
            input: string,
        ) => `foo:${input}`, 'bar');
        expect(output).toEqual('foo:bar');
    });

    it('should evaluate fn with two arguments', () => {
        const output = evaluateFnOrValue((
            prefix: string,
            suffix: string,
        ) => `${prefix}:${suffix}`, 'bar', 'baz');

        expect(output).toEqual('bar:baz');
    });
});
