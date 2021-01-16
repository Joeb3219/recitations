import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Meeting, MeetingType, Section, StandardResponseInterface } from '@dynrec/common';
import { environment } from '@environment';
import { getFilterParams } from 'app/decorators';
import { plainToClass } from 'class-transformer';
import { MeetingWithLesson } from '../../../../common/src/models/meeting';

@Injectable()
export class MeetingService {
    constructor(private http: HttpClient) {}

    public async getMeetingTime(course: Course): Promise<StandardResponseInterface<Meeting<MeetingType>[]>> {
        const url = `${environment.apiURL}/course/${course.id}/meetings`;

        const params = getFilterParams({ limit: -1 });

        return new Promise((resolve, reject) => {
            this.http
                .get<StandardResponseInterface<Meeting<MeetingType>[]>>(url, { params })
                .subscribe(
                    result => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = result.data.map(item => plainToClass(Meeting, item));
                            resolve(result);
                        } else reject(new Error('No result returned'));
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
        });
    }

    public async getSectionMeetingTimes(
        section: Section
    ): Promise<StandardResponseInterface<MeetingWithLesson<MeetingType>[]>> {
        const url = `${environment.apiURL}/section/${section.id}/meetings`;

        const params = getFilterParams({ limit: -1 });

        return new Promise((resolve, reject) => {
            this.http
                .get<StandardResponseInterface<MeetingWithLesson<MeetingType>[]>>(url, { params })
                .subscribe(
                    result => {
                        if (result) {
                            // eslint-disable-next-line no-param-reassign
                            result.data = result.data.map(item => plainToClass(MeetingWithLesson, item));
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
