import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, StandardResponseInterface } from '@dynrec/common';
import { environment } from '@environment';
import { GetRequest, UpsertRequest } from '../decorators';

@Injectable()
export class CourseService {
    constructor(private http: HttpClient) {}

    public async getCourses(): Promise<Course[]> {
        const url = `${environment.apiURL}/course`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<Course[]>>(url).subscribe(
                (result: StandardResponseInterface<Course[]>) => {
                    if (result) resolve(result.data);
                    else reject(new Error('No result returned'));
                },
                (err: Error) => {
                    reject(err);
                }
            );
        });
    }

    @UpsertRequest<Course>(Course)
    public async upsertCourse(course: Course): Promise<StandardResponseInterface<Course>> {
        throw new Error('Decorator Overloading Failed');
    }

    @GetRequest<Course>(Course)
    public async getCourse(courseID: string): Promise<StandardResponseInterface<Course>> {
        throw new Error('Decorator Overloading Failed');
    }
}
