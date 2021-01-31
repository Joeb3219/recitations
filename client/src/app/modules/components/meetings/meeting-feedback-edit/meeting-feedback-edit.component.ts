import { Component, Input, OnInit } from '@angular/core';
import {
    Course,
    Form,
    FormInput,
    MeetingReport,
    MeetingWithLesson,
    ProblemFeedbackInterface,
    Section,
} from '@dynrec/common';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from '../../../../services/meeting.service';
import { MeetingReportService } from '../../../../services/meetingReport.service';
import { RosterService } from '../../../../services/roster.service';

@Component({
    selector: 'app-meeting-feedback-edit',
    templateUrl: './meeting-feedback-edit.component.html',
    styleUrls: ['./meeting-feedback-edit.component.scss'],
})
export class MeetingFeedbackEditComponent implements OnInit {
    meetings: MeetingWithLesson[];

    @Input() course: Course;
    @Input() date: Date;

    report: MeetingReport;

    form: Form;
    sections: Section[];

    loading: boolean = false;

    constructor(
        private readonly meetingService: MeetingService,
        private readonly rosterService: RosterService,
        private readonly meetingReportService: MeetingReportService,
        private readonly toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.loadMeetings();
    }

    generateForm() {
        console.log(this.date);
        const allLessons = _.uniqBy(
            this.meetings.map(meeting => meeting.lesson),
            lesson => lesson.id
        );

        const uniqueProblems = _.compact(
            _.uniqBy(
                _.flatten(_.flatten(allLessons.map(lesson => lesson.lessonPlan.steps)).map(step => step.problem)),
                problem => problem?.id
            )
        );

        const allStudents = _.compact(_.flatten((this.sections ?? []).map(section => section.students)));

        this.form = new Form();
        this.form.inputGroups = [
            { name: 'general', label: 'General Feedback', page: 0 },
            ...uniqueProblems.map(problem => ({ name: problem.id, label: `Problem: ${problem.name}`, page: 0 })),
            { name: 'roster', label: 'Roster', page: 0 },
        ];

        const problemInputs = uniqueProblems.map<FormInput[]>(problem => {
            const feedback = this.report.problemFeedback.find(response => response.problem === problem.id);

            return [
                {
                    name: `problem_${problem.id}_completed`,
                    label: 'Completed',
                    group: problem.id,
                    type: 'select',
                    value: feedback?.completed,
                    options: [
                        { label: 'Completed', value: true },
                        { label: 'Did not Complete', value: false },
                    ],
                    row: 0,
                    col: 0,
                },
                {
                    name: `problem_${problem.id}_duration`,
                    label: 'Duration',
                    type: 'number',
                    group: problem.id,
                    value: feedback?.duration,
                    row: 0,
                    col: 1,
                },
                {
                    name: `problem_${problem.id}_receptivity`,
                    label: 'Receptivity',
                    type: 'select',
                    group: problem.id,
                    value: feedback?.receptivity,
                    row: 1,
                    col: 0,
                    options: [
                        { label: 'No engagement', value: 0 },
                        { label: 'Little engagement', value: 1 },
                        { label: 'Moderate engagement', value: 3 },
                        { label: 'Very engaged', value: 5 },
                    ],
                },
                {
                    name: `problem_${problem.id}_comments`,
                    label: 'Comments',
                    value: feedback?.comments,
                    type: 'text',
                    group: problem.id,
                    row: 1,
                    col: 1,
                },
            ];
        });

        this.form.inputs = [
            {
                name: 'feedback',
                label: 'How did your recitation go?',
                type: 'text',
                row: 0,
                col: 0,
                group: 'general',
                value: this.report.feedback,
            },
            ..._.flattenDeep(problemInputs),
            {
                name: 'roster',
                label: 'Roster',
                type: 'roster',
                group: 'roster',
                course: this.course,
                users: allStudents,
                value: this.report.studentsPresent ?? [],
                row: 0,
                col: 0,
            },
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async formSubmitted(data: any) {
        this.report.meetingTimes = this.meetings.map(meeting => meeting.meetingTime);
        this.report.feedback = data.feedback;
        this.report.studentsPresent = data.roster;

        this.report.problemFeedback = this.reduceProblemFeedback(data);

        try {
            const result = await this.meetingReportService.upsertMeetingReport(this.report);
            this.report = result.data;
            this.toastr.success('Successfully submitted post meeting report.');
        } catch (err) {
            this.toastr.error('Failed to submit post meeting report.');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reduceProblemFeedback(data: any): ProblemFeedbackInterface[] {
        const keys = Object.keys(data).filter(key => key.includes('problem_'));
        const problemIds = _.uniq(_.compact(keys.map(key => key.split('_')[1])));

        return problemIds.map(id => ({
            problem: id,
            completed: data[`problem_${id}_completed`],
            duration: data[`problem_${id}_duration`],
            receptivity: data[`problem_${id}_receptivity`],
            comments: data[`problem_${id}_comments`],
        }));
    }

    generateDefaultReport() {
        this.report = new MeetingReport({
            course: this.course,
            date: this.date,
            meetingTimes: this.meetings.map(meeting => meeting.meetingTime),
            problemFeedback: [],
            studentsPresent: [],
        });
    }

    async loadMeetings() {
        this.loading = true;
        const result = await this.meetingService.getMeetingLessonsAtTime(this.course, this.date);
        this.meetings = result.data;

        const rosterResult = await this.rosterService.listSectionsRosters(this.course);

        this.sections = rosterResult.data.filter(section =>
            this.meetings.find(meeting => meeting.meetingTime.meetable.id === section.id)
        );

        try {
            const reportResult = await this.meetingReportService.getMeetingReportOnDate(this.course, this.date);
            this.report = reportResult.data;
        } catch (err) {
            this.generateDefaultReport();
        }

        if (!this.report) {
            this.generateDefaultReport();
        }

        this.generateForm();
        this.loading = false;
    }
}
