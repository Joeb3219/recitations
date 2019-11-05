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

	userCourses: Course[] = []
	selectedCourse: Course = null

	constructor(
		private _userService: UserService,
		private _courseService: CourseService,
	) {}

	ngOnInit() {
		this._userService.getCurrentUser().subscribe({
			next: async (user) => {
				this.userCourses = await this._courseService.getCourses()
			}
		})
	}

	toggleActivteCourse(course){
		if(this.selectedCourse && this.selectedCourse._id == course._id) this.selectedCourse = null
		else this.selectedCourse = course
	}

}
