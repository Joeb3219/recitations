import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { CourseService } from '@services/course.service';
import { SectionService } from '@services/section.service';

import { Course } from '@models/course'
import { Section } from '@models/section'

@Component({
  selector: 'app-view-sections',
  templateUrl: './view-sections.component.html',
  styleUrls: ['./view-sections.component.scss']
})
export class ViewSectionsComponent implements OnInit {

  	course: Course
  	sections: Section[]
  	isLoading: boolean = true

  	isNewSectionModalOpen: boolean = false

	constructor(
		private _courseService: CourseService,
		private _sectionService: SectionService,
		private route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.route.params.subscribe(async (params) => {
			if(params['courseID']) {
				this.course = await this._courseService.getCourse(params['courseID'])
				this.sections = await this._sectionService.getCourseSections(this.course)
				console.log(this.sections)
				this.isLoading = false
			}
		});
	}

	handleCloseNewSectionModal() {
		this.isNewSectionModalOpen = false
	}

	handleOpenNewSectionModal() {
		this.isNewSectionModalOpen = true
	}

}
