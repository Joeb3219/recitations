import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs'

import { environment } from '@environment'

import { MeetingTime } from '@models/meetingTime'

@Injectable()
export class MeetingTimeService {

	constructor(
		private http: HttpClient
	){}

	public getHeaders(){
		return new HttpHeaders({
			'Content-Type':  'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('jwt')
		})
	}

	public async createMeetingTime(meetingTime: MeetingTime) : Promise<MeetingTime>{
		const url = `${environment.apiURL}/meetingTime`
		return new Promise((resolve, reject) => {
			this.http.put(url, meetingTime, { headers: this.getHeaders() }).subscribe((result: { data: MeetingTime }) => {
				if(result) resolve(result.data)
				else reject(new Error("No result returned"))
			}, (err) => {
				reject(err)
			})
		})		
	}

	// public async getCourses() : Promise<Course[]>{
	// 	const url = `${environment.apiURL}/course`
	// 	return new Promise((resolve, reject) => {
	// 		this.http.get(url, { headers: this.getHeaders() }).subscribe((result: { data: Course[] }) => {
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
	// 		this.http.get(url, { headers: this.getHeaders() }).subscribe((result: { data: Course }) => {
	// 			if(result) resolve(result.data)
	// 			else reject(new Error("No result returned"))
	// 		}, (err) => {
	// 			reject(err)
	// 		})
	// 	})
	// }

}