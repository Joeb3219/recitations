import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { Course } from '@models/course';
import { Problem } from '@models/problem';
import { StandardResponseInterface } from '../../../../common/interfaces/http/standardResponse.interface';

@Injectable({
    providedIn: 'root',
})
export class ProblemService {
    constructor(private http: HttpClient) {}

    public async upsertProblem(
        problem: Problem
    ): Promise<StandardResponseInterface<Problem>> {
        const problemID = problem.id;
        const url = problemID
            ? `${environment.apiURL}/problem/${problemID}`
            : `${environment.apiURL}/problem`;
        let action;

        if (problemID) action = this.http.put(url, problem);
        else action = this.http.post(url, problem);

        return new Promise((resolve, reject) => {
            action.subscribe(
                (result: StandardResponseInterface<Problem>) => {
                    if (result) resolve(result);
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    public async getCourseProblems(
        course: Course | string,
        filter: HttpFilterInterface = undefined
    ): Promise<StandardResponseInterface<Problem[]>> {
        // if course is an object, we will grab its id
        // otherwise, we assume course is a string representing the id
        const courseID = typeof course === 'string' ? course : course.id;

        const url = `${environment.apiURL}/course/${courseID}/problems`;

        let params = new HttpParams();
        if (filter) {
            params = Object.keys(filter).reduce(
                (prev, curr) =>
                    filter[curr] ? prev.append(curr, filter[curr]) : prev,
                params
            );
        }

        return new Promise((resolve, reject) => {
            this.http.get(url, { params }).subscribe(
                (result: StandardResponseInterface<Problem[]>) => {
                    if (result) resolve(result);
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    public async getProblem(problemID: string): Promise<Problem> {
        const url = `${environment.apiURL}/problem/${problemID}`;

        return new Promise((resolve, reject) => {
            this.http.get(url).subscribe(
                (result: { data: Problem }) => {
                    if (result) resolve(result.data);
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    public async deleteProblem(problemID: string): Promise<void> {
        const url = `${environment.apiURL}/problem/${problemID}`;

        return new Promise((resolve, reject) => {
            this.http.delete(url).subscribe(
                (result) => {
                    if (result) resolve();
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }
}
