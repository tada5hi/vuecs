export function calculatePage(context: { offset: number, limit: number}) {
    return Math.floor(context.offset / context.limit) + 1;
}

export function calculatePagesTotal(context: { limit: number, total: number}) {
    return Math.max(Math.ceil(context.total / context.limit), 1);
}

export function calculateOffset(context: { page: number, limit: number}) {
    return (context.page - 1) * context.limit;
}
