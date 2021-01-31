import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, StandardResponseInterface, StudentMeetingReport } from '@dynrec/common';
import { environment } from '@environment';
import { plainToClass } from 'class-transformer';

@Injectable({
    providedIn: 'root',
})
export class StudentMeetingReportService {
    constructor(private http: HttpClient) {}

    public async upsertResponse(
        report: StudentMeetingReport,
        code: string
    ): Promise<StandardResponseInterface<StudentMeetingReport>> {
        const url = `${environment.apiURL}/studentmeetingreport`;

        return new Promise((resolve, reject) => {
            this.http
                .post<StandardResponseInterface<StudentMeetingReport>>(url, { ...report, code })
                .subscribe(
                    result => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = plainToClass(StudentMeetingReport, result.data);
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
        });
    }

    public async getAllReports(
        course: Course,
        start: Date,
        end: Date
    ): Promise<StandardResponseInterface<StudentMeetingReport[]>> {
        const url = `${environment.apiURL}/course/${course.id}/quiz/range/${start.toISOString()}/${end.toISOString()}`;

        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<StudentMeetingReport[]>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = result.data.map(report => plainToClass(StudentMeetingReport, report));
                        resolve(result);
                    } else reject(new Error('No result returned'));
                },
                (err: Error) => {
                    reject(err);
                }
            );
        });
    }

    public async getReport(
        course: Course,
        date: Date,
        code: string
    ): Promise<StandardResponseInterface<StudentMeetingReport>> {
        const url = `${environment.apiURL}/course/${course.id}/quiz/${date.toISOString()}/code/${code}`;

        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<StudentMeetingReport>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = plainToClass(StudentMeetingReport, result.data);
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
