import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment';

import { MeetingTime } from '@models/meetingTime';

@Injectable()
export class MeetingTimeService {
    constructor(private http: HttpClient) {}

    public async createMeetingTime(
        meetingTime: MeetingTime
    ): Promise<MeetingTime> {
        const url = `${environment.apiURL}/meetingTime`;
        return new Promise((resolve, reject) => {
            this.http.put(url, meetingTime).subscribe(
                (result: { data: MeetingTime }) => {
                    if (result) resolve(result.data);
                    else reject(new Error('No result returned'));
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    // public async getCourses() : Promise<Course[]>{
    // 	const url = `${environment.apiURL}/course`
    // 	return new Promise((resolve, reject) => {
    // 		this.http.get(url).subscribe((result: { data: Course[] }) => {
    // 			if(result) resolve(result.data)
    // 			else reject(new Error("No result returned"))
    // 		}, (err) => {
    // 			reject(err)
    // 		})
    // 	})
    // }

    // public async getCourse(courseID: string) : Promise<Course>{
    // 	const url = `${environment.apiURL}/course/${courseID}`
    // 	return new Promise((resolve, reject) => {
    // 		this.http.get(url).subscribe((result: { data: Course }) => {
    // 			if(result) resolve(result.data)
    // 			else reject(new Error("No result returned"))
    // 		}, (err) => {
    // 			reject(err)
    // 		})
    // 	})
    // }
}
