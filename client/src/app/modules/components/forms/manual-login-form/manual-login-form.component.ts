import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { UserService } from '@services/user.service';

import { Form } from '@models/forms/form';

@Component({
  selector: 'app-manual-login-form',
  templateUrl: './manual-login-form.component.html',
  styleUrls: ['./manual-login-form.component.scss']
})
export class ManualLoginFormComponent implements OnInit {

	form: Form = null;
	@Output() onSuccessfulLogin: EventEmitter<string> = new EventEmitter<string>()

	constructor(
		private _userService: UserService
	) { }

	ngOnInit() {
		this.generateForm();
	}

	generateForm(){
		this.form = new Form();
		this.form.inputs = [{
			type: 'text',
			name: 'username',
			label: 'Username',
		}, {
			type: 'password',
			name: 'password',
			label: 'Password',
		}]
	}

	formSubmitted(data){
		var { username, password } = data;
		this._userService.signin(username, password).subscribe((result: any) => {
			console.log(result)
			if(result && result.data){
				this.onSuccessfulLogin.emit(result.data)
			}
		}, (err) => {
			console.error(err)
		});
	}

}
