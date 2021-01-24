import * as csv from 'fast-csv';
import _ from 'lodash';
import { CourseRosterData, RosterDatasource, RosterType } from './roster.datasource';

interface CanvasRosterRow {
    Student: string;
    UserID: string;
    LoginID: string;
    Section: string;
}

export class CanvasRoster extends RosterDatasource {
    id: RosterType = 'canvas';
    name: string = 'Canvas';
    description: string = 'Canvas roster format, used by the Canvas Learning Management Software.';
    fileTypes: string[] = ['csv'];

    private async parseCSV(path: string): Promise<CanvasRosterRow[]> {
        const parsed = await csv.parseFile<csv.ParserRow<CanvasRosterRow>, csv.ParserRow<CanvasRosterRow>>(path, {
            skipLines: 0,
            headers: ['Student', 'UserID', 'LoginID', 'Section'],
            discardUnmappedColumns: true,
            strictColumnHandling: true,
            renameHeaders: true,
        });
        const rows: CanvasRosterRow[] = [];
        return new Promise((resolve, reject) => {
            parsed
                .on('data', row => rows.push(row))
                .on('end', () => resolve(rows))
                .on('error', err => reject(err));
        });
    }

    parseRoster = async (path: string): Promise<CourseRosterData> => {
        const parsed = await this.parseCSV(path);

        return parsed.map(row => {
            const [lastName, firstName, rest] = row.Student.includes(',')
                ? row.Student.split(', ')
                : row.Student.split(' ');
            return {
                user: {
                    username: row.UserID.trim(),
                    firstName: lastName?.trim(),
                    lastName: firstName?.trim(),
                },
                section: {
                    index: undefined,
                    sectionNumber: _.last(row.Section.split(':'))?.trim() ?? '0',
                },
            };
        });
    };

    validateRoster = async (path: string) => {
        return true;
    };
}
