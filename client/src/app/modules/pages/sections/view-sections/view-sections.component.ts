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

  	selectedEditSection: Section = null

  	isEditSectionModalOpen: boolean = false

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
				this.isLoading = false
			}
		});
	}

	handleOpenNewSectionModal() {
		this.isEditSectionModalOpen = true

		this.selectedEditSection = new Section()
		this.selectedEditSection.course = this.course;
	}
	
	handleCloseEditSectionModal() {
		this.isEditSectionModalOpen = false

		// And now we add the section if needed
		// We perform a search for if there is a section with that id already
		const foundSection = this.sections.find((section) => {
			if(section.id == this.selectedEditSection.id) return true
		})

		// if the section was found, we already have it in our array, and the data would be updated via the component
		// if it wasn't found, we insert it new.
		if(!foundSection) this.sections.push(this.selectedEditSection)

		this.selectedEditSection = null;
	}

	handleOpenEditSectionModal(section: Section) {
		this.isEditSectionModalOpen = true
		this.selectedEditSection = section
	}

}
