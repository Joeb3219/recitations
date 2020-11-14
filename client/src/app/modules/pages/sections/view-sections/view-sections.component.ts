import { Component, EventEmitter } from '@angular/core';
import { DatatableColumn } from '@components/datatable/datatable.component';
import { Course, Section, StandardResponseInterface } from '@dynrec/common';
import { HttpFilterInterface } from '@http/httpFilter.interface';
import { CourseService } from '@services/course.service';
import { LoadedArg } from '../../../../decorators';
import { SectionService } from '../../../../services/section.service';

@Component({
    selector: 'app-view-sections',
    templateUrl: './view-sections.component.html',
    styleUrls: ['./view-sections.component.scss'],
})
export class ViewSectionsComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    selectedSection?: Section = undefined;

    isEditSectionModalOpen = false;

    isDeleteSectionModalOpen = false;

    refreshData: EventEmitter<void> = new EventEmitter();

    columns: DatatableColumn<Section>[] = [
        {
            name: 'Section Number',
            prop: 'sectionNumber',
        },
        {
            name: 'Index',
            prop: 'index',
        },
        {
            name: 'TA',
            prop: 'ta',
            cellTemplate: 'userCell',
        },
        {
            name: 'Instructor',
            prop: 'instructor',
            cellTemplate: 'userCell',
        },
        {
            name: 'Instructor',
            prop: 'instructor',
            cellTemplate: 'userCell',
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: Section) => [
                {
                    text: 'View',
                    href: `/courses/${row.course.id}/section/${row.id}`,
                },
                {
                    text: 'Modify',
                    click: () => this.handleOpenEditSectionModal(row),
                },
                {
                    text: 'Delete',
                    click: () => this.handleOpenDeleteSectionModal(row),
                },
            ],
        },
    ];

    constructor(private SectionService: SectionService) {
        this.fetchSections = this.fetchSections.bind(this);
    }

    async fetchSections(
        args: HttpFilterInterface
    ): Promise<StandardResponseInterface<Section[]>> {
        return this.SectionService.getCourseSections(this.course, args);
    }

    handleOpenNewSectionModal(): void {
        this.isEditSectionModalOpen = true;

        this.selectedSection = new Section();
        this.selectedSection.course = this.course;
    }

    handleCloseEditSectionModal(): void {
        this.isEditSectionModalOpen = false;
        this.selectedSection = undefined;
        this.refreshData.next();
    }

    handleOpenEditSectionModal(section: Section): void {
        this.isEditSectionModalOpen = true;
        this.selectedSection = section;
    }

    handleOpenDeleteSectionModal(section: Section): void {
        this.isDeleteSectionModalOpen = true;
        this.selectedSection = section;
    }

    handleCloseDeleteSectionModal(): void {
        this.isDeleteSectionModalOpen = false;
        this.refreshData.next();
    }
}
