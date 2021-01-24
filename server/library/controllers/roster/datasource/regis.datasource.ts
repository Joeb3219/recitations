import * as csv from 'fast-csv';
import { CourseRosterData, RosterDatasource, RosterType } from './roster.datasource';

interface RegisRosterRow {
    Sec: string;
    Index: string;
    Id: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Comment: string;
    Unit: string;
    Class: string;
    Curric1: string;
    Opt1: string;
    Curric2: string;
    Loc: string;
    Permission: string;
    BA: string;
    NetID: string;
}

export class RegisRoster extends RosterDatasource {
    id: RosterType = 'regis';
    name: string = 'REGIS';
    description: string =
        'Rosters & Electronic Grading Information System (REGIS), an internal system used at Rutgers University.';
    fileTypes: string[] = ['csv'];

    private async parseCSV(path: string): Promise<RegisRosterRow[]> {
        const parsed = await csv.parseFile<csv.ParserRow<RegisRosterRow>, csv.ParserRow<RegisRosterRow>>(path, {
            skipLines: 2,
            headers: [
                'Sec',
                'Index',
                'Id',
                'FirstName',
                'LastName',
                'Comment',
                'Warning',
                'Comment2',
                'Unit',
                'Email',
                'Class',
                'Curric1',
                'Opt1',
                'Curric2',
                'Loc',
                'Permission',
                'BA',
                '',
                'NetID',
            ],
            discardUnmappedColumns: true,
            strictColumnHandling: true,
            renameHeaders: true,
        });
        const rows: RegisRosterRow[] = [];
        return new Promise((resolve, reject) => {
            parsed
                .on('data', row => rows.push(row))
                .on('end', () => resolve(rows))
                .on('error', err => reject(err));
        });
    }

    parseRoster = async (path: string): Promise<CourseRosterData> => {
        const parsed = await this.parseCSV(path);

        return parsed.map(row => ({
            user: {
                username: row.NetID,
                firstName: row.FirstName,
                lastName: row.LastName,
                email: row.Email,
            },
            section: {
                index: row.Index,
                sectionNumber: row.Sec,
            },
        }));
    };

    validateRoster = async (path: string) => {
        return true;
    };
}
