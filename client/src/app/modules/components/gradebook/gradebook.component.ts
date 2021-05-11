import { Component, Input } from '@angular/core';
import { Course, CourseGradebookEntryPayload } from '@dynrec/common';
import dayjs from 'dayjs';
import _ from 'lodash';
import { CourseGradebookEntryScorePayload } from '../../../../../../common/src/api/payloads/gradebook/courseGradebookEntry.payload';
import { GradebookService } from '../../../services/gradebook.service';
const weekOfYear = require('dayjs/plugin/weekOfYear');
dayjs.extend(weekOfYear);

@Component({
    selector: 'app-gradebook',
    templateUrl: './gradebook.component.html',
    styleUrls: ['./gradebook.component.scss'],
})
export class GradebookComponent {
    @Input()
    course: Course;

    loading: boolean = false;

    constructor(private readonly gradebookService: GradebookService) {}

    async handleDownloadGradebook() {
        if (!this.course) {
            return;
        }

        this.loading = true;
        const result = await this.gradebookService.getCourseGradebook(this.course);
        this.loading = false;
        this.handleCSVExport(result.data);
    }

    getWeekNumber(date: string | Date): number {
        const converted = dayjs(date);
        return (converted as any).week();
    }

    handleCSVExport(payloads: CourseGradebookEntryPayload[]) {
        const csvStringWrap = (str: string) => {
            const escapedStr = `${str}`.replace(/"/g, '""');
            return `"${escapedStr}"`;
        };

        const allDates = _.uniq(
            _.flatten(
                payloads.map(payload =>
                    payload.scores.map((score: CourseGradebookEntryScorePayload) => this.getWeekNumber(score.date))
                )
            )
        );

        const headers = ['Student', ...allDates.map(w => `Week ${w} 2021`)].map(name => csvStringWrap(name)).join(',');

        const csvRows = payloads.map(payload => {
            const rowCells = [
                csvStringWrap(payload.studentId),
                ...allDates.map(weekNum => {
                    const score = payload.scores.find(
                        (score: CourseGradebookEntryScorePayload) => this.getWeekNumber(score.date) === weekNum
                    );

                    if (!score) {
                        return -1;
                    }

                    return score.score;
                }),
            ];

            // Join all cells within the row w/ a comma, as they're already escaped
            return rowCells.join(',');
        });

        const csv = [headers, ...csvRows].join('\r\n');
        this.downloadFile(csv);
    }

    // Adapted from https://stackoverflow.com/questions/51806464/how-to-create-and-download-text-json-file-with-dynamic-content-using-angular-2
    downloadFile(contents: string): void {
        const element = document.createElement('a');
        const fileType = 'text/csv';
        const fileName = `gradebook.csv`;

        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(contents)}`);
        element.setAttribute('download', fileName);

        const event = new MouseEvent('click');
        element.dispatchEvent(event);
    }
}
