import { Component, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatatableColumn } from '@components/datatable/datatable.component';
import {
    Course,
    Lesson,
    MeetingType,
    MeetingWithLesson,
    Section,
    StandardResponseInterface,
    StudentMeetingReport,
    User,
} from '@dynrec/common';
import dayjs from 'dayjs';
import { MeetingService } from '../../../../services/meeting.service';
import { UserService } from '../../../../services/user.service';

@Component({
    selector: 'app-section-view',
    templateUrl: './section-view.component.html',
    styleUrls: ['./section-view.component.scss'],
})
export class SectionViewComponent implements OnChanges {
    @Input() course: Course;
    @Input() section: Section;

    refreshData: EventEmitter<void> = new EventEmitter();
    meetings: MeetingWithLesson[];

    selectedLesson?: Omit<Lesson, 'id'> & { id: undefined | string };
    isEditLessonModalOpen: boolean = false;

    currentUser: User | undefined;

    columns: DatatableColumn<MeetingWithLesson<MeetingType.RECITATION> & { id?: undefined }>[] = [
        {
            name: 'Date',
            prop: 'date',
            cellTemplate: 'dateCell',
        },
        {
            name: 'Lesson',
            prop: 'lesson',
            cellTemplate: 'lessonCell',
        },
        {
            name: 'Leader',
            prop: 'leader',
            cellTemplate: 'userCell',
        },
        {
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: MeetingWithLesson<MeetingType.RECITATION> & { getAccessCode: () => string }) => [
                {
                    text: 'Join with Zoom',
                    if: (row.meetingTime.meetingLink !== null && row.meetingTime.meetingLink !== ''),
                    click: () => {
                        if (row.meetingTime.meetingLink != null) {
                            window.open(row.meetingTime.meetingLink, '_blank');
                        }
                    },
                },
                {
                    text: 'Access Code',
                    can: {
                        action: 'create',
                        subject: this.getSampleLesson(row),
                    },
                    click: () => {
                        // Stupid, and hacky, but Datatables doesn't currently support sending over the needed functions data, just the json.
                        const foundMeeting = this.meetings.find(m => m.date === row.date);

                        if (foundMeeting) {
                            // eslint-disable-next-line no-alert
                            window.alert(`Access code: ${foundMeeting.getAccessCode()}`);
                        }
                    },
                },
                {
                    text: 'Update Lesson',
                    can: {
                        action: 'create',
                        subject: this.getSampleLesson(row),
                    },
                    click: () => this.handleOpenEditLessonModal(row),
                },
                {
                    text: 'Feedback & Attendance',
                    can: {
                        action: 'create',
                        subject: this.getSampleLesson(row),
                    },
                    href: `/courses/${row.lesson.course.id}/meeting-feedback/${row.date.toISOString?.() ?? row.date}`,
                    if: dayjs().tz().isAfter(row.date),
                },
                {
                    text: 'View Feedback',
                    can: {
                        action: 'create',
                        subject: this.getSampleLesson(row),
                    },
                    href: `/courses/${row.lesson.course.id}/sections/${this.section.id}/reports/${
                        row.date.toISOString?.() ?? row.date
                    }`,
                    if: dayjs().tz().isAfter(row.date),
                },
                {
                    text: 'Take Quiz',
                    can: {
                        action: 'create',
                        subject: new StudentMeetingReport({ course: this.section.course }),
                    },
                    href: `/courses/${row.lesson.course.id}/quiz/${row.date.toISOString?.() ?? row.date}`,
                    if: new MeetingWithLesson(row).canTakeQuiz(this.course),
                },
            ],
        },
    ];

    constructor(private readonly meetingService: MeetingService, private readonly userService: UserService) {
        this.fetchMeetingTimes = this.fetchMeetingTimes.bind(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            this.refreshData.next();
        }
    }

    getSampleLesson(meeting: MeetingWithLesson<MeetingType.RECITATION>): Lesson {
        return new Lesson({
            meetingTime: meeting.meetingTime,
            course: this.section.course,
            beginDate: meeting.date,
            endDate: meeting.date,
        });
    }

    handleOpenEditLessonModal(meeting: MeetingWithLesson): void {
        this.isEditLessonModalOpen = true;
        this.selectedLesson = meeting.lesson.meetingTime
            ? meeting.lesson
            : { ...meeting.lesson, meetingTime: meeting.meetingTime, id: undefined };
    }

    handleCloseEditLessonModal() {
        this.isEditLessonModalOpen = false;
        this.selectedLesson = undefined;
        this.refreshData.next();
    }

    async fetchMeetingTimes(): Promise<
        StandardResponseInterface<(MeetingWithLesson<MeetingType.RECITATION> & { id?: undefined })[]>
    > {
        const result = await this.meetingService.getSectionMeetingTimes(this.section);

        const recitationsResult: StandardResponseInterface<MeetingWithLesson<MeetingType.RECITATION>[]> = {
            ...result,
            data: result.data.filter(
                (e): e is MeetingWithLesson<MeetingType.RECITATION> => e.meetingType === MeetingType.RECITATION
            ),
        };

        this.meetings = recitationsResult.data;

        return recitationsResult;
    }
}
