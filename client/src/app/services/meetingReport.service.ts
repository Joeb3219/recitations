import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, MeetingReport, StandardResponseInterface } from '@dynrec/common';
import { environment } from '@environment';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { plainToClass } from 'class-transformer';
import { DeleteRequest, GetRequest, ListRequest, UpsertRequest } from '../decorators';

@Injectable({
    providedIn: 'root',
})
export class MeetingReportService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<MeetingReport>(MeetingReport, 'meetingReport')
    public async upsertMeetingReport(report: MeetingReport): Promise<StandardResponseInterface<MeetingReport>> {
        throw new Error('Decorator Overloading Failed');
    }

    @ListRequest<MeetingReport>(MeetingReport, 'meetingReport')
    public async getCourseMeetingReports(
        course: Course,
        filter?: HttpFilterInterface
    ): Promise<StandardResponseInterface<MeetingReport[]>> {
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
}
