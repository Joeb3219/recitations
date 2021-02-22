import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, StandardResponseInterface, StudentGradebookPayload } from '@dynrec/common';
import { environment } from '@environment';
import { plainToClass } from 'class-transformer';

@Injectable({
    providedIn: 'root',
})
export class GradebookService {
    constructor(private http: HttpClient) {}

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
