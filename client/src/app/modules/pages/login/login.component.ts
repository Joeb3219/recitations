import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { environment } from '@environment'

import { UserService } from '@services/user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	authMechanism: string = '';

  	constructor(
  		private _router: Router,
  		private _userService: UserService
  	) { }

	ngOnInit() {
		this.authMechanism = environment.authMechanism;

		// First, we check if the user already has a jwt
		// If so, we will log them out :)
		if(localStorage.getItem("jwt")){
			this.successfulLogout();
		}
	}

	successfulLogout(){
		localStorage.removeItem("jwt")
		this._userService.signOut();
	}

	successfulLogin(jwt){
		localStorage.setItem("jwt", jwt)
		this._userService.flushCurrentUser()
		this._router.navigate(['/'])
	}

}
