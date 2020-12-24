import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course, Meeting, MeetingType, StandardResponseInterface } from '@dynrec/common';
import { environment } from '@environment';

@Injectable()
export class MeetingService {
    constructor(private http: HttpClient) {}

    public async getMeetingTime(course: Course): Promise<StandardResponseInterface<Meeting<MeetingType>[]>> {
        const url = `${environment.apiURL}/course/${course.id}/meetings`;
        return new Promise((resolve, reject) => {
            this.http.get<StandardResponseInterface<Meeting<MeetingType>[]>>(url).subscribe(
                result => {
                    if (result) {
                        // eslint-disable-next-line no-param-reassign
                        result.data = result.data.map(item => new Meeting(item));
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
