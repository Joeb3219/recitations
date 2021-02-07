import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, GradebookOverride, StandardResponseInterface } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { DeleteRequest, GetRequest, ListRequest, UpsertRequest } from '../decorators';

@Injectable({
    providedIn: 'root',
})
export class GradebookOverrideService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<GradebookOverride>(GradebookOverride, 'gradebookoverride')
    public async upsertGradebookOverride(
        override: GradebookOverride
    ): Promise<StandardResponseInterface<GradebookOverride>> {
        throw new Error('Decorator Overloading Failed');
    }

    @ListRequest<GradebookOverride>(GradebookOverride, 'gradebookoverride')
    public async getCourseGradebookOverrides(
        course: Course,
        filter?: HttpFilterInterface
    ): Promise<StandardResponseInterface<GradebookOverride[]>> {
        throw new Error('Decorator Overloading Failed');
    }

    @GetRequest<GradebookOverride>(GradebookOverride, 'gradebookoverride')
    public async getGradebookOverride(overrideID: string): Promise<StandardResponseInterface<GradebookOverride>> {
        throw new Error('Decorator Overloading Failed');
    }

    @DeleteRequest<GradebookOverride>(GradebookOverride, 'gradebookoverride')
    public async deleteGradebookOverride(overrideID: string): Promise<StandardResponseInterface<void>> {
        throw new Error('Decorator Overloading Failed');
    }
}
