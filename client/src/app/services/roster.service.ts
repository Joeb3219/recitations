import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Course,
    CourseRosterPayload,
    RosterFormatPayload,
    StandardResponseInterface,
    UpdateRosterPayload,
} from '@dynrec/common';
import { environment } from '@environment';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { plainToClass } from 'class-transformer';
import { getFilterParams } from '../decorators/request.decorator';

@Injectable({
    providedIn: 'root',
})
export class RosterService {
    constructor(private http: HttpClient) {}

    public getRosterFormats(): Promise<StandardResponseInterface<RosterFormatPayload[]>> {
        const url = `${environment.apiURL}/roster/formats`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<RosterFormatPayload[]>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = result.data.map(item => plainToClass(RosterFormatPayload, item));
                        resolve(result);
                    } else reject(new Error('No result returned'));
                },
                (err: Error) => {
                    reject(err);
                }
            );
        });
    }

    public updateRoster(
        course: Course,
        rosterType: string,
        rosterPath: string,
        verification: boolean = true
    ): Promise<StandardResponseInterface<UpdateRosterPayload>> {
        const url = `${environment.apiURL}/course/${course.id}/roster/${rosterType}${verification ? `/verify` : ``}`;
        return new Promise((resolve, reject) => {
            this.http
                .put<StandardResponseInterface<UpdateRosterPayload>>(url, { rosterPath })
                .subscribe(
                    result => {
                        if (result) {
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
        });
    }

    public async listCourseRoster(
        course: Course,
        filter?: HttpFilterInterface
    ): Promise<StandardResponseInterface<CourseRosterPayload[]>> {
        const url = `${environment.apiURL}/course/${course.id}/roster`;
        const params = getFilterParams(filter);
        return new Promise((resolve, reject) => {
            this.http
                .get<StandardResponseInterface<CourseRosterPayload[]>>(url, { params })
                .subscribe(
                    result => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = result.data.map(section => plainToClass(CourseRosterPayload, section));
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
