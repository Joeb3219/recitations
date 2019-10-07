import { Component, OnInit } from '@angular/core'

import { Router } from '@angular/router'

import { UserService } from '@services/user.service'
import { User } from '@models/user'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	user: User = null

	constructor(
		private _userService: UserService,
		private _router: Router
	) { }

	async ngOnInit() {
		this.user = await this._userService.getCurrentUser();

		this._router.events.subscribe(async (val) => {
			this.user = await this._userService.getCurrentUser();
		})

	}

}
