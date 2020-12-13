import { Component, EventEmitter } from '@angular/core';
import { Course, Quiz, StandardResponseInterface } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { LoadedArg } from '../../../../decorators';
import { HttpFilterInterface } from '../../../../http/httpFilter.interface';
import { QuizService } from '../../../../services/quiz.service';
import { DatatableColumn } from '../../../components/datatable/datatable.component';

@Component({
    selector: 'app-list-quizzes',
    templateUrl: './list-quizzes.component.html',
    styleUrls: ['./list-quizzes.component.scss'],
})
export class ListQuizzesComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    refreshData: EventEmitter<void> = new EventEmitter();

    columns: DatatableColumn<Quiz>[] = [
        {
            name: 'Name',
            prop: 'name',
        },
        {
            name: 'Creator',
            prop: 'creator',
            cellTemplate: 'userCell',
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: Quiz) => [
                {
                    text: 'View',
                    href: `/courses/${row.course.id}/quizzes/${row.id}`,
                },
                {
                    text: 'Modify',
                    click: () => this.handleOpenEditQuizModal(row),
                },
                {
                    text: 'Delete',
                    click: () => this.handleOpenDeleteQuizModal(row),
                },
            ],
        },
    ];

    selectedEditQuiz?: Quiz = undefined;

    selectedDeleteQuiz?: Quiz = undefined;

    isEditQuizModalOpen = false;

    isDeleteQuizModalOpen = false;

    constructor(private quizService: QuizService) {
        this.fetchQuizzes = this.fetchQuizzes.bind(this);
    }

    async fetchQuizzes(args: HttpFilterInterface): Promise<StandardResponseInterface<Quiz[]>> {
        return this.quizService.getCourseQuizes(this.course, args);
    }

    handleOpenNewQuizModal(): void {
        this.isEditQuizModalOpen = true;

        this.selectedEditQuiz = new Quiz();
        this.selectedEditQuiz.course = this.course;
    }

    handleCloseEditQuizModal(): void {
        this.isEditQuizModalOpen = false;

        this.selectedEditQuiz = undefined;

        this.refreshData.emit();
    }

    handleOpenEditQuizModal(quiz: Quiz): void {
        this.isEditQuizModalOpen = true;
        this.selectedEditQuiz = quiz;
    }

    handleOpenDeleteQuizModal(quiz: Quiz): void {
        this.isDeleteQuizModalOpen = true;
        this.selectedDeleteQuiz = quiz;
    }

    handleCloseDeleteQuizModal(): void {
        this.isDeleteQuizModalOpen = false;
        this.refreshData.emit();
    }
}
