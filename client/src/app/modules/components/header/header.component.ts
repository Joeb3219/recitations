import { Component, OnInit } from '@angular/core'

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
	) { }

	async ngOnInit() {
		this._userService.getCurrentUser().subscribe({
			next: (currentUser) => {
				this.user = currentUser
			}
		})
	}

}
