import { Component, OnInit, Input } from '@angular/core';

import { User } from '@models/user'

@Component({
  selector: 'app-user-badge',
  templateUrl: './user-badge.component.html',
  styleUrls: ['./user-badge.component.scss']
})
export class UserBadgeComponent implements OnInit {

	@Input() user: User = null

	constructor() { }

	ngOnInit() {
	}

}
