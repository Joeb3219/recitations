import { Component, Input, OnInit } from '@angular/core';
import {
    QuizElementId,
    QuizElementItem,
    QuizElementResponsePayload,
    Section,
    StudentMeetingReport,
} from '@dynrec/common';
import _ from 'lodash';
import { StudentMeetingReportService } from '../../../../services/studentMeetingReport.service';

type ResponseBucket = {
    element: QuizElementItem<QuizElementId>;
    responses: {
        response: string;
        count: number;
    }[];
};

@Component({
    selector: 'app-reports-section-view',
    templateUrl: './reports-section-view.component.html',
    styleUrls: ['./reports-section-view.component.scss'],
})
export class ReportsSectionViewComponent implements OnInit {
    @Input() section: Section;
    @Input() date: Date;

    loading: boolean = false;

    reports?: StudentMeetingReport[];
    responses: ResponseBucket[];

    constructor(private readonly studentMeetingReportService: StudentMeetingReportService) {}

    ngOnInit(): void {
        this.loadReports();
    }

    async loadReports() {
        this.loading = true;
        const result = await this.studentMeetingReportService.getSectionReports(this.section, this.date);
        this.reports = result.data;

        this.processReport();
        this.loading = false;
    }

    processReport() {
        if (!this.reports?.length) {
            this.responses = [];
        }

        const quiz = this.reports![0].quiz;
        this.responses = quiz.elements.map((element, idx) => ({
            element,
            responses: this.generateResponses(
                element,
                (this.reports ?? []).map(report => report.answers[idx].response)
            ),
        }));
    }

    generateResponses<Element extends QuizElementId = QuizElementId>(
        element: QuizElementItem<Element> | undefined,
        responses: QuizElementResponsePayload<Element>[]
    ): {
        response: string;
        count: number;
    }[] {
        const allResponses = responses.map(r => this.generateResponseString(element, r));

        const counts = _.countBy(allResponses, _.identity);

        return Object.keys(counts).map(response => ({
            response,
            count: counts[response],
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
