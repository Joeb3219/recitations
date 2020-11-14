import { Component, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Course, Problem, StandardResponseInterface } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { ProblemService } from '@services/problem.service';
import { LoadedArg } from '../../../../decorators';
import { HttpFilterInterface } from '../../../../http/httpFilter.interface';
import { DatatableColumn } from '../../../components/datatable/datatable.component';

@Component({
    selector: 'app-list-problems',
    templateUrl: './list-problems.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list-problems.component.scss'],
})
export class ListProblemsComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    refreshData: EventEmitter<void> = new EventEmitter();

    columns: DatatableColumn<Problem>[] = [
        {
            name: 'Name',
            prop: 'name',
        },
        {
            name: 'Difficulty',
            prop: 'difficulty',
            cellTemplate: 'difficultyCell',
        },
        {
            name: 'Creator',
            prop: 'creator',
            cellTemplate: 'userCell',
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: Problem) => [
                {
                    text: 'View',
                    href: `/courses/${row.course.id}/problems/${row.id}`,
                },
                {
                    text: 'Modify',
                    click: () => this.handleOpenEditProblemModal(row),
                },
                {
                    text: 'Delete',
                    click: () => this.handleOpenDeleteProblemModal(row),
                },
            ],
        },
    ];

    selectedEditProblem?: Problem = undefined;

    selectedDeleteProblem?: Problem = undefined;

    isEditProblemModalOpen = false;

    isDeleteProblemModalOpen = false;

    constructor(private problemService: ProblemService) {
        this.fetchProblems = this.fetchProblems.bind(this);
    }

    async fetchProblems(
        args: HttpFilterInterface
    ): Promise<StandardResponseInterface<Problem[]>> {
        return this.problemService.getCourseProblems(this.course, args);
    }

    handleOpenNewProblemModal(): void {
        this.isEditProblemModalOpen = true;

        this.selectedEditProblem = new Problem();
        this.selectedEditProblem.course = this.course;
    }

    handleCloseEditProblemModal(): void {
        this.isEditProblemModalOpen = false;

        this.selectedEditProblem = undefined;

        this.refreshData.emit();
    }

    handleOpenEditProblemModal(problem: Problem): void {
        this.isEditProblemModalOpen = true;
        this.selectedEditProblem = problem;
    }

    handleOpenDeleteProblemModal(problem: Problem): void {
        this.isDeleteProblemModalOpen = true;
        this.selectedDeleteProblem = problem;
    }

    handleCloseDeleteProblemModal(): void {
        this.isDeleteProblemModalOpen = false;
        this.refreshData.emit();
    }
}
