import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
    Course,
    Meeting,
    Quiz,
    QuizElementId,
    QuizElementItem,
    QuizElementResponsePayload,
    StudentMeetingReport,
} from '@dynrec/common';
import _ from 'lodash';
import { StudentMeetingReportService } from '../../../../services/studentMeetingReport.service';

type QuizBucket<Element extends QuizElementId = QuizElementId> = {
    quiz: Quiz;
    element: QuizElementItem<Element>;
    responses: (string | undefined)[];
    reports: StudentMeetingReport[];
};

@Component({
    selector: 'app-view-student-feedback',
    templateUrl: './view-student-feedback.component.html',
    styleUrls: ['./view-student-feedback.component.scss'],
})
export class ViewStudentFeedbackComponent implements OnInit, OnChanges {
    @Input() course: Course;
    @Input() startDate: Date;
    @Input() endDate: Date;
    @Input() meetings: Meeting[];

    reports?: StudentMeetingReport[];
    loading: boolean = false;
    quizBuckets: QuizBucket[];

    constructor(private readonly studentMeetingReportService: StudentMeetingReportService) {}

    ngOnInit(): void {
        this.generateReport();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.generateReport();
        }
    }

    async generateReport() {
        this.loading = true;

        if (!this.startDate || !this.endDate) {
            this.loading = false;
            return;
        }

        const results = await this.studentMeetingReportService.getAllReports(this.course, this.startDate, this.endDate);

        this.reports = results.data;

        this.processReport();

        this.loading = false;
    }

    processReport() {
        const uniqueQuizzes = _.uniqBy(this.reports?.map(report => report.quiz) ?? [], quiz => quiz.id);
        const uniqueQuizElements = _.flatten(
            uniqueQuizzes.map(quiz => quiz.elements.map(element => ({ quiz, element })))
        );

        this.quizBuckets = uniqueQuizElements.map(({ quiz, element }, index) => ({
            quiz,
            element,
            reports: this.reports?.filter(report => report.quiz.id === quiz.id) ?? [],
            responses: (this.reports?.filter(report => report.quiz.id === quiz.id) ?? []).map(report =>
                this.generateResponseString(element, report.answers[index]?.response)
            ),
        }));
    }

    generateResponseString<Element extends QuizElementId = QuizElementId>(
        element: QuizElementItem<Element> | undefined,
        response: QuizElementResponsePayload<Element> | undefined
    ): string | undefined {
        if (!element || !response) {
            return undefined;
        }
        switch (element.elementId) {
            case 'free_response':
                return ((response as unknown) as QuizElementResponsePayload<'free_response'>['response']).response;
            case 'multiple_choice':
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return _.compact(
                    ((response as unknown) as QuizElementResponsePayload<'multiple_choice'>['response']).selections.map(
                        (id: string) =>
                            `${
                                (element as QuizElementItem<'multiple_choice'>).config.options.find(
                                    option => option.value === id
                                )?.label
                            }`
                    ) as string[]
                ).join(', ');
            default:
                return '';
        }
    }
}
