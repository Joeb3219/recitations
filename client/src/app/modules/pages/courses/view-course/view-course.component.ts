import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { CourseService } from '@services/course.service';

import { Course } from '@models/course';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss']
})
export class ViewCourseComponent implements OnInit {

	course: Course = null
	isLoading: boolean = true

	constructor(
		private _courseService: CourseService,
		private route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.route.params.subscribe(async (params) => {
			if(params['courseID']) {
				this.course = await this._courseService.getCourse(params['courseID'])
				this.isLoading = false
			}
		});
	}

}
