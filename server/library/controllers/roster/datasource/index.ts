import { CanvasRoster } from './canvas.datasource';
import { RegisRoster } from './regis.datasource';
export * from './roster.datasource';
export { RegisRoster, CanvasRoster };

export const ALL_ROSTER_TYPES = [RegisRoster, CanvasRoster];
