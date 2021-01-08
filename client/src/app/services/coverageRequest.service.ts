import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, CoverageRequest, StandardResponseInterface } from '@dynrec/common';
import { environment } from '@environment';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { plainToClass } from 'class-transformer';
import { DeleteRequest, GetRequest, ListRequest, UpsertRequest } from '../decorators';

@Injectable({
    providedIn: 'root',
})
export class CoverageRequestService {
    constructor(private http: HttpClient) {}

    @UpsertRequest<CoverageRequest>(CoverageRequest)
    public async upsertCoverageRequest(request: CoverageRequest): Promise<StandardResponseInterface<CoverageRequest>> {
        throw new Error('Decorator Overloading Failed');
    }

    @ListRequest<CoverageRequest>(CoverageRequest)
    public async getCourseCoverageRequests(
        course: Course,
        filter?: HttpFilterInterface
    ): Promise<StandardResponseInterface<CoverageRequest[]>> {
        throw new Error('Decorator Overloading Failed');
    }

    @GetRequest<CoverageRequest>(CoverageRequest)
    public async getCoverageRequest(requestID: string): Promise<StandardResponseInterface<CoverageRequest>> {
        throw new Error('Decorator Overloading Failed');
    }

    @DeleteRequest<CoverageRequest>(CoverageRequest)
    public async deleteCoverageRequest(requestID: string): Promise<StandardResponseInterface<void>> {
        throw new Error('Decorator Overloading Failed');
    }

    public toggleCoverageRequestCoverage(
        request: CoverageRequest
    ): Promise<StandardResponseInterface<CoverageRequest>> {
        const url = `${environment.apiURL}/course/${request.course.id}/coveragerequest/${request.id}/cover`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<CoverageRequest>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = plainToClass(CoverageRequest, result.data);
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
