import {
    Component,
    EventEmitter,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '@models/course';
import { Problem } from '@models/problem';
import { CourseService } from '@services/course.service';
import { ProblemService } from '@services/problem.service';
import { HttpFilterInterface } from '../../../../http/httpFilter.interface';

@Component({
    selector: 'app-list-problems',
    templateUrl: './list-problems.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./list-problems.component.scss'],
})
export class ListProblemsComponent implements OnInit {
    tableRows: Array<any>;

    tableColumns: Array<any> = [
        {
            prop: 'problemName',
            name: 'Problem Name',
        },
        {
            prop: 'difficulty',
            name: 'Difficulty',
        },
        {
            prop: 'duration',
            name: 'Est. Duration (min)',
        },
        {
            prop: 'creator',
            name: 'Creator',
        },
        {
            prop: 'id',
            name: 'Actions',
            actions: ['modify', 'delete', 'view'],
        },
    ];

    course: Course;

    problems: Problem[];

    isLoading = true;

    refreshData: EventEmitter<any> = new EventEmitter();

    columns = [
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
            actions: (row) => [
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

    selectedEditProblem: Problem = null;

    selectedDeleteProblem: Problem = null;

    isEditProblemModalOpen = false;

    isDeleteProblemModalOpen = false;

    constructor(
        private courseService: CourseService,
        private problemService: ProblemService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.fetchProblems = this.fetchProblems.bind(this);
    }

    ngOnInit() {
        this.route.params.subscribe(async (params) => {
            if (params.courseID) {
                this.course = await this.courseService.getCourse(
                    params.courseID
                );
                this.isLoading = false;
            }
        });
    }

    async fetchProblems(args: HttpFilterInterface): Promise<Problem[]> {
        return (await this.problemService.getCourseProblems(this.course, args))
            ?.data;
    }

    handleOpenNewProblemModal(): void {
        this.isEditProblemModalOpen = true;

        this.selectedEditProblem = new Problem();
        this.selectedEditProblem.course = this.course;
    }

    handleCloseEditProblemModal(): void {
        this.isEditProblemModalOpen = false;

        this.selectedEditProblem = null;

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

    handleCloseDeleteProblemModal($event): void {
        this.isDeleteProblemModalOpen = false;
        this.refreshData.emit();
    }

    getMinuteUnit(estimatedDuration: number): string {
        return Problem.getMinuteUnit(estimatedDuration);
    }

    handleOnDelete($event: any): void {
        const problemID = $event;
        const problem = this.problems.find(
            (problem) => problem.id === problemID
        );
        this.handleOpenDeleteProblemModal(problem);
    }

    handleOnModify($event: any): void {
        const problemID = $event;
        const problem = this.problems.find(
            (problem) => problem.id === problemID
        );
        this.handleOpenEditProblemModal(problem);
    }

    handleOnView($event: any): void {
        const problemID = $event;
        const courseID = this.course.id;
        this.router.navigateByUrl(`/courses/${courseID}/problems/${problemID}`);
    }
}
