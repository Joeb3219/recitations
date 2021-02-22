import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, MeetingReport, StandardResponseInterface } from '@dynrec/common';
import { environment } from '@environment';
import { plainToClass } from 'class-transformer';
import { DeleteRequest, GetRequest, UpsertRequest } from '../decorators';
import { getFilterParams } from '../decorators/request.decorator';

@Injectable({
    providedIn: 'root',
})
export class MeetingReportService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<MeetingReport>(MeetingReport, 'meetingReport')
    public async upsertMeetingReport(report: MeetingReport): Promise<StandardResponseInterface<MeetingReport>> {
        throw new Error('Decorator Overloading Failed');
    }

    @GetRequest<MeetingReport>(MeetingReport, 'meetingReport')
    public async getMeetingReport(reportID: string): Promise<StandardResponseInterface<MeetingReport>> {
        throw new Error('Decorator Overloading Failed');
    }

    @DeleteRequest<MeetingReport>(MeetingReport, 'meetingReport')
    public async deleteMeetingReport(reportID: string): Promise<StandardResponseInterface<void>> {
        throw new Error('Decorator Overloading Failed');
    }

    public async getMeetingReportOnDate(course: Course, date: Date): Promise<StandardResponseInterface<MeetingReport>> {
        const url = `${environment.apiURL}/course/${course.id}/meetingReports/date/${date.toISOString()}`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<MeetingReport>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = plainToClass(MeetingReport, result.data);
                        resolve(result);
                    } else reject(new Error('No result returned'));
                },
                (err: Error) => {
                    reject(err);
                }
            );
        });
    }

    public async getMeetingReportsInRange(
        course: Course,
        start: Date,
        end: Date
    ): Promise<StandardResponseInterface<MeetingReport[]>> {
        const url = `${environment.apiURL}/course/${
            course.id
        }/meetingReports/range/${start.toISOString()}/${end.toISOString()}`;

        const params = getFilterParams({ limit: -1 });

        return new Promise((resolve, reject) => {
            this.http
                .get<StandardResponseInterface<MeetingReport[]>>(url, { params })
                .subscribe(
                    result => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = result.data.map(report => plainToClass(MeetingReport, report));
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
        });
    }
}
