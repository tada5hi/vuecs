/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {OptionsInput} from "../../type";
import {ExpectListBaseBuildOptions, ListBaseOptions} from "../type";
import {MaybeRef} from "../../../type";

export type ListSearchBuildOptions = ListBaseOptions & {
    value?: MaybeRef<unknown>,

    change?: (input: any) => void,
};

export type ListSearchBuildOptionsInput = OptionsInput<
    ExpectListBaseBuildOptions<ListSearchBuildOptions>,
    never,
    'change'
    >;
