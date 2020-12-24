export function dateRange(a: Date, b: Date, intervalMs = 86400000): Date[] {
    const result: Date[] = [];
    while (a.getTime() <= b.getTime()) {
        result.push(new Date(a));

        // eslint-disable-next-line no-param-reassign
        a = new Date(a.getTime() + intervalMs);
    }

    return result;
}
