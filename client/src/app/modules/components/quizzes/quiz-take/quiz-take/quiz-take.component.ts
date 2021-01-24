import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Course, getQuizElementDefinition, QuizElementAnswerInterface, StudentMeetingReport } from '@dynrec/common';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { StudentMeetingReportService } from '../../../../../services/studentMeetingReport.service';

@Component({
    selector: 'app-quiz-take',
    templateUrl: './quiz-take.component.html',
    styleUrls: ['./quiz-take.component.scss'],
})
export class QuizTakeComponent {
    @Input() date: Date;
    @Input() course: Course;

    report?: StudentMeetingReport;
    accessCode?: string = '';
    loading: boolean = false;

    quizReadyToSubmit: boolean = false;
    errors: number[] = [];

    constructor(
        private readonly studentMeetingReportService: StudentMeetingReportService,
        private readonly toastr: ToastrService,
        private readonly router: Router
    ) {}

    handleUpdateAccessCode() {
        this.loadReport();
    }

    async loadReport() {
        if (!this.accessCode) {
            this.toastr.error('No access code provided.');
        }

        this.loading = true;

        try {
            const result = await this.studentMeetingReportService.getReport(
                this.course,
                this.date,
                this.accessCode ?? ''
            );
            this.report = result.data;
        } catch (err) {
            this.toastr.error('Invalid access code, or something went wrong.');
        } finally {
            this.loading = false;
        }
    }

    handleQuizUpdated(answers: QuizElementAnswerInterface[]) {
        if (!this.report || !answers) {
            return;
        }

        this.report.answers = answers;
        this.quizReadyToSubmit = this.validateQuiz();
    }

    async handleSubmitQuiz() {
        if (!this.report || !this.accessCode) {
            return;
        }

        this.loading = true;
        try {
            await this.studentMeetingReportService.upsertResponse(this.report, this.accessCode);
            this.toastr.success('Successfully submitted quiz.');
            this.router.navigate(['/courses', this.course.id, 'sections']);
        } catch {
            this.toastr.error('Failed to submit quiz.');
        } finally {
            this.loading = false;
        }
    }

    validateQuiz(): boolean {
        if (!this.report) {
            return false;
        }

        if (this.report.answers.length !== this.report.quiz.elements.length) {
            return false;
        }

        this.errors = [];
        return _.every(
            this.report.quiz.elements.map((element, idx) => {
                const answer = this.report?.answers[idx];

                if (!answer) return false;

                try {
                    const definition = getQuizElementDefinition(element.elementId);

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const result = definition.validateSubmission(element.config as any, answer.response as any);
                    if (!result) this.errors.push(idx);

                    return result;
                } catch (err) {
                    this.errors.push(idx);
                    return false;
                }
            })
        );
    }
}
