import _ from 'lodash';

export function dateRange(a: Date, b: Date, intervalMs = 86400000): Date[] {
    const totalIntervals = Math.ceil((b.getTime() - a.getTime()) / intervalMs);

    return _.range(0, totalIntervals).map(idx => new Date(a.getTime() + intervalMs * idx));
}
