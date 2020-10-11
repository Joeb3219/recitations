import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { StandardResponseInterface } from '@interfaces/http/standardResponse.interface';
import { Course } from '@models/course';
import { Problem } from '@models/problem';
import {
    DeleteRequest,
    GetRequest,
    ListRequest,
    UpsertRequest,
} from '../decorators';

@Injectable({
    providedIn: 'root',
})
export class ProblemService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<Problem>(Problem)
    public async upsertProblem(
        problem: Problem
    ): Promise<StandardResponseInterface<Problem>> {
        return undefined;
    }

    @ListRequest<Problem>(Problem)
    public async getCourseProblems(
        course: Course,
        filter: HttpFilterInterface = undefined
    ): Promise<StandardResponseInterface<Problem[]>> {
        return undefined;
    }

    @GetRequest<Problem>(Problem)
    public async getProblem(
        problemID: string
    ): Promise<StandardResponseInterface<Problem>> {
        return undefined;
    }

    @DeleteRequest<Problem>(Problem)
    public async deleteProblem(
        problemID: string
    ): Promise<StandardResponseInterface<void>> {
        return undefined;
    }
}
