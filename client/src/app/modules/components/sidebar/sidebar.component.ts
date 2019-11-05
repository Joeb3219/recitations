import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

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
		private router: Router,
	) {}

	ngOnInit() {
		this._userService.getCurrentUser().subscribe({
			next: async (user) => {
				this.userCourses = await this._courseService.getCourses()
				this.setActiveCourseFromRouter()
			}
		})

		// this router subscription will follow any changes in the current route
		// this will allow for us to determine which course is currently being focused on,
		// which subpiece to highlight, etc.
		// we do this by examining URL changes, and on each change, breaking the URL down into its slugs and
		// comparing those slugs with what we current have stored.
		this.router.events.subscribe({
			next: async (event) => {
				console.log(event)
				// ensure this event describes a URL change
				if(event && event["url"]){
					this.setActiveCourseFromRouter()
				}				
			}
		})
	}

	// this function will check what's going on in the router,
	// and attempt to set the active course in the sidebar depending on what the loaded course is
	setActiveCourseFromRouter(){
		const url = this.router.url
		this.userCourses.forEach((course) => {
			// this slug is the prefix to the URL that would indicate that this course is 
			// currently active/being worked in. 
			const slug = `/courses/${course._id}`
			if(url.indexOf(slug) == 0){
				this.selectedCourse = course
			}
		})
	}

	// toggles what the currently selected course is
	// this function is triggered by the UI element. 
	handleToggleActiveCourse(course: Course){
		if(this.selectedCourse && this.selectedCourse._id == course._id) this.selectedCourse = null
		else this.selectedCourse = course
	}

}
