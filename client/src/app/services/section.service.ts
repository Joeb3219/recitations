import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs'

import { environment } from '@environment'

import { Course } from '@models/course'
import { Section } from '@models/section'
import {Problem} from "@models/problem";

@Injectable()
export class SectionService {

	constructor(
		private http: HttpClient
	){}

	public getHeaders(){
		return new HttpHeaders({
			'Content-Type':  'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('jwt')
		})
	}

	public async upsertSection(section: Section) : Promise<Section>{
		const sectionID = section.id
		const url = (sectionID) ? `${environment.apiURL}/section/${sectionID}` : `${environment.apiURL}/section`
		let action

		if(sectionID) action = this.http.put(url, section, { headers: this.getHeaders() })
		else action = this.http.post(url, section, { headers: this.getHeaders() })

		return new Promise((resolve, reject) => {
			action.subscribe((result: { data: Section }) => {
				if(result) resolve(result.data)
				else reject(new Error("No result returned"))
			}, (err) => {
				reject(err)
			})
		})
	}

	public async getCourseSections(course: Course | String) : Promise<Section[]>{
		// if course is an object, we will grab its id
		// otherwise, we assume course is a string representing the id
		const courseID = (course instanceof String) ? course : course.id

		const url = `${environment.apiURL}/course/${courseID}/sections`

		return new Promise((resolve, reject) => {
			this.http.get(url, { headers: this.getHeaders() }).subscribe((result: { data: Section[] }) => {
				if(result) resolve(result.data)
				else reject(new Error("No result returned"))
			}, (err) => {
				reject(err)
			})
		})
	}

	public async deleteSection(sectionID: string){
    const url = `${environment.apiURL}/section/${sectionID}`;

    return new Promise((resolve, reject) => {
      this.http.delete(url, { headers: this.getHeaders() }).subscribe((result: { data: Section }) => {
        if(result) resolve(result.data)
        else reject(new Error("No result returned"))
      }, (err) => {
        reject(err)
      })
    })
  }


}
