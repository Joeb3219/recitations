import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, StandardResponseInterface, StudentGradebookPayload } from '@dynrec/common';
import { environment } from '@environment';
import { plainToClass } from 'class-transformer';
import { CourseGradebookEntryPayload } from '../../../../common/src/api/payloads/gradebook/courseGradebookEntry.payload';
import { getFilterParams } from '../decorators/request.decorator';

@Injectable({
    providedIn: 'root',
})
export class GradebookService {
    constructor(private http: HttpClient) {}

    public async getCourseGradebook(course: Course): Promise<StandardResponseInterface<CourseGradebookEntryPayload[]>> {
        const url = `${environment.apiURL}/gradebook/${course.id}`;
        const params = getFilterParams({ limit: -1 });

        return new Promise((resolve, reject) => {
            this.http
                .get<StandardResponseInterface<CourseGradebookEntryPayload[]>>(url, { params })
                .subscribe(
                    result => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = result.data.map(user => plainToClass(CourseGradebookEntryPayload, user));
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
        });
    }

    public async getPersonalGradebook(course: Course): Promise<StandardResponseInterface<StudentGradebookPayload[]>> {
        const url = `${environment.apiURL}/gradebook/${course.id}/me`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<StudentGradebookPayload[]>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = result.data.map(user => plainToClass(StudentGradebookPayload, user));
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
