import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs'

import { environment } from '@environment'

import { Course } from '@models/course'
import { Problem } from '@models/problem'

@Injectable({
  providedIn: 'root'
})
export class ProblemService {

	constructor(
		private http: HttpClient
	){}

	public getHeaders(){
		return new HttpHeaders({
			'Content-Type':  'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('jwt')
		})
	}

	public async upsertProblem(problem: Problem) : Promise<Problem>{
		const problemID = problem.id
		const url = (problemID) ? `${environment.apiURL}/problem/${problemID}` : `${environment.apiURL}/problem`
		let action

		if(problemID) action = this.http.put(url, problem, { headers: this.getHeaders() })
		else action = this.http.post(url, problem, { headers: this.getHeaders() })

		console.log(problem)

		return new Promise((resolve, reject) => {
			action.subscribe((result: { data: Problem }) => {
				if(result) resolve(result.data)
				else reject(new Error("No result returned"))
			}, (err) => {
				reject(err)
			})
		})
	}

	public async getCourseProblems(course: Course | String) : Promise<Problem[]>{
		// if course is an object, we will grab its id
		// otherwise, we assume course is a string representing the id
		const courseID = (course instanceof String) ? course : course.id

		const url = `${environment.apiURL}/course/${courseID}/problems`

		return new Promise((resolve, reject) => {
			this.http.get(url, { headers: this.getHeaders() }).subscribe((result: { data: Problem[] }) => {
				if(result) resolve(result.data)
				else reject(new Error("No result returned"))
			}, (err) => {
				reject(err)
			})
		})
	}

}