import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '@models/course';
import { Section } from '@models/section';
import { CourseService } from '@services/course.service';
import { SectionService } from '@services/section.service';

@Component({
    selector: 'app-view-sections',
    templateUrl: './view-sections.component.html',
    styleUrls: ['./view-sections.component.scss'],
})
export class ViewSectionsComponent implements OnInit {
    course: Course;

    sections: Section[];

    isLoading = true;

    selectedEditSection: Section = null;

    selectedDeleteSection: Section = null;

    isEditSectionModalOpen = false;

    isDeleteSectionModalOpen = false;

    constructor(
        private courseService: CourseService,
        private sectionService: SectionService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(async (params) => {
            if (params.courseID) {
                this.course = await this.courseService.getCourse(
                    params.courseID
                );
                this.sections = await this.sectionService.getCourseSections(
                    this.course
                );
                this.isLoading = false;
            }
        });
    }

    handleOpenNewSectionModal(): void {
        this.isEditSectionModalOpen = true;

        this.selectedEditSection = new Section();
        this.selectedEditSection.course = this.course;
    }

    handleCloseEditSectionModal(): void {
        this.isEditSectionModalOpen = false;

        // And now we add the section if needed
        // We perform a search for if there is a section with that id already
        const foundSection = this.sections.find((section) => {
            return section.id === this.selectedEditSection.id;
        });

        // if the section was found, we already have it in our array, and the data would be updated via the component
        // if it wasn't found, we insert it new.
        if (!foundSection) this.sections.push(this.selectedEditSection);

        this.selectedEditSection = null;
    }

    handleOpenEditSectionModal(section: Section): void {
        this.isEditSectionModalOpen = true;
        this.selectedEditSection = section;
    }

    handleOpenDeleteSectionModal(section: Section): void {
        // let result = this.sectionService.deleteSection(section.id);
        this.isDeleteSectionModalOpen = true;
        this.selectedDeleteSection = section;
    }

    handleCloseDeleteSectionModal($event): void {
        this.isDeleteSectionModalOpen = false;

        if ($event) {
            this.sections.splice(
                this.sections.indexOf(this.selectedDeleteSection),
                1
            );
        }
    }
}
