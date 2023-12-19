/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function calculatePage(context: { offset: number, limit: number}) {
    return Math.floor(context.offset / context.limit) + 1;
}

export function calculatePagesTotal(context: { limit: number, total: number}) {
    return Math.max(Math.ceil(context.total / context.limit), 1);
}

export function calculateOffset(context: { page: number, limit: number}) {
    return (context.page - 1) * context.limit;
}
