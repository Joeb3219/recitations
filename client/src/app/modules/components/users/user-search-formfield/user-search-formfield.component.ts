import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UserService } from '@services/user.service'

import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

import { User } from '@models/user'

@Component({
  selector: 'app-user-search-formfield',
  templateUrl: './user-search-formfield.component.html',
  styleUrls: ['./user-search-formfield.component.scss']
})
export class UserSearchFormfieldComponent implements OnInit {

	@Input() user: User = null
	@Input() name: string = null
	@Output() change: EventEmitter<User> = new EventEmitter<User>()

	users: User[]

	constructor(
		private _userService: UserService,
	) { }

	async ngOnInit() {
		this.users = await this._userService.getUsers()
	}

	formatter = (user: User) => {
		if(user) return `${user.firstName} ${user.lastName} (${user.username}, ${user.email})`
		else return ``
	}

	handleUserSelected (user: User) {
		this.change.emit(user)
	}

	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map(term => term === '' ? []
				: this.users.filter(
					user => {
						return user.firstName.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
							user.lastName.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
							user.email.toLowerCase().indexOf(term.toLowerCase()) > -1  ||
							user.username.toLowerCase().indexOf(term.toLowerCase()) > -1 
						}
				).slice(0, 10))
	)


	handleUpdate(data) {
		console.log(data)
	}

}
