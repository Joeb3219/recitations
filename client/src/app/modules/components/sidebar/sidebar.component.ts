import { Component, OnInit } from '@angular/core';

import { UserService } from '@services/user.service'
import { CourseService } from '@services/course.service'

import { Course } from '@models/course'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

	sidebarURLs: {
		url: string,
		name: string
	}[] = []

	userCourses: Course[] = []

	constructor(
		private _userService: UserService,
		private _courseService: CourseService,
	) {}

	ngOnInit() {
		this._userService.getCurrentUser().subscribe({
			next: async (user) => {
				this.sidebarURLs = []
				if(user) await this.generateLoggedInSidebar()
				else this.generateLoggedOutSidebar()
			}
		})
		this.generateLoggedOutSidebar();
	}

	async generateLoggedInSidebar(){
		this.userCourses = await this._courseService.getCourses()
	
		this.userCourses.forEach((course) => {
			this.sidebarURLs.push({
				url: `courses/${course._id}`,
				name: course.name
			})
		})

	}

	generateLoggedOutSidebar(){
		this.sidebarURLs.push({
			url: 'foo',
			name: 'Foo',
		})
		this.sidebarURLs.push({
			url: 'bar',
			name: 'Bar',
		})
	}

}
