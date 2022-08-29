/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ComponentConfig } from './component';
import { CSSFramework } from './constants';

export type Config = {
    framework: CSSFramework,
    frameworkMergeWithDefaults: boolean,
    component: ComponentConfig,
};
