import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environment'

import { User } from '@models/user'

@Injectable()
export class UserService {

	private currentUser: User = null;

	constructor(
		private http: HttpClient
	){}

	public getHeaders(){
		return new HttpHeaders({
				'Content-Type':  'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('jwt')
			})
	}

	public signOut(){
		this.currentUser = null;
	}

	public async getCurrentUser(){
		if(this.currentUser == null && localStorage.getItem('jwt')){
			const userRequest = (await this.getMyUserObject().toPromise()) as any;
			if(userRequest) this.currentUser = userRequest.data
		}

		return this.currentUser;
	}

	public getMyUserObject(){
		const url = `${environment.apiURL}/user/me`
		return this.http.get(url, { headers: this.getHeaders() })
	}

	public getUser(username: string){

	}

	public signin(username: string, password: string){
		const url = `${environment.apiURL}/user/signin`
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			})
		};
		return this.http.post(url, { username, password }, {  })
	}

}