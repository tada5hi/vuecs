/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

/**
 * Transform preset.component.option -> component.option.preset.
 *
 * @param input
 */
export function transformPresetsInput(
    input: Record<string, Record<string, any>>,
) {
    const data : Record<string, Record<string, any>> = {};

    const pKeys = Object.keys(input);
    for (let i = 0; i < pKeys.length; i++) {
        const cKeys = Object.keys(input[pKeys[i]]);
        for (let j = 0; j < cKeys.length; j++) {
            if (!Object.prototype.hasOwnProperty.call(data, cKeys[j])) {
                data[cKeys[j]] = {};
            }

            const oKeys = Object.keys(input[pKeys[i]][cKeys[j]]);
            for (let k = 0; k < oKeys.length; k++) {
                if (!Object.prototype.hasOwnProperty.call(data[cKeys[j]], oKeys[k])) {
                    data[cKeys[j]][oKeys[k]] = {};
                }

                data[cKeys[j]][oKeys[k]][pKeys[i]] = input[pKeys[i]][cKeys[j]][oKeys[k]];
            }
        }
    }

    return data;
}
