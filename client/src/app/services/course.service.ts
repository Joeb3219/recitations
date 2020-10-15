import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { StandardResponseInterface } from '@interfaces/http/standardResponse.interface';
import { Course } from '@models/course';
import { GetRequest, UpsertRequest } from '../decorators';

@Injectable()
export class CourseService {
    constructor(private http: HttpClient) {}

    public async getCourses(): Promise<Course[]> {
        const url = `${environment.apiURL}/course`;
        return new Promise((resolve, reject) => {
            this.http.get(url).subscribe(
                (result: { data: Course[] }) => {
                    if (result) resolve(result.data);
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    @UpsertRequest<Course>(Course)
    public async upsertCourse(
        course: Course
    ): Promise<StandardResponseInterface<Course>> {
        return undefined;
    }

    @GetRequest<Course>(Course)
    public async getCourse(
        courseID: string
    ): Promise<StandardResponseInterface<Course>> {
        return undefined;
    }
}
