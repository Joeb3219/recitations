import { Component, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatatableColumn } from '@components/datatable/datatable.component';
import { Lesson, MeetingType, MeetingWithLesson, Section } from '@dynrec/common';
import dayjs from 'dayjs';
import { MeetingService } from '../../../../services/meeting.service';

@Component({
    selector: 'app-section-view',
    templateUrl: './section-view.component.html',
    styleUrls: ['./section-view.component.scss'],
})
export class SectionViewComponent implements OnChanges {
    @Input() section: Section;

    refreshData: EventEmitter<void> = new EventEmitter();
    meetings: MeetingWithLesson[];

    selectedLesson?: Omit<Lesson, 'id'> & { id: undefined | string };
    isEditLessonModalOpen: boolean = false;

    columns: DatatableColumn<MeetingWithLesson<MeetingType.RECITATION>>[] = [
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
            name: 'Actions',
            cellTemplate: 'actionsCell',
            actions: (row: MeetingWithLesson<MeetingType.RECITATION> & { getAccessCode: () => string }) => [
                {
                    text: 'Access Code',
                    can: {
                        action: 'create',
                        subject: new Lesson({ meetingTime: row.meetingTime, course: this.section.course }),
                    },
                    click: () => {
                        // Stupid, and hacky, but Datatables doesn't currently support sending over the needed functions data, just the json.
                        const foundMeeting = this.meetings.find(m => m.date === row.date);

                        if (foundMeeting) {
                            window.alert(`Access code: ${foundMeeting.getAccessCode()}`);
                        }
                    },
                },
                {
                    text: 'Update Lesson',
                    can: {
                        action: 'create',
                        subject: new Lesson({ meetingTime: row.meetingTime, course: this.section.course }),
                    },
                    click: () => this.handleOpenEditLessonModal(row),
                },
                {
                    text: 'Feedback & Attendance',
                    can: {
                        action: 'create',
                        subject: new Lesson({ meetingTime: row.meetingTime, course: this.section.course }),
                    },
                    href: `/courses/${row.lesson.course.id}/meeting-feedback/${row.date.toISOString?.() ?? row.date}`,
                    if: dayjs().isAfter(row.date),
                },
            ],
        },
    ];

    constructor(private readonly meetingService: MeetingService) {
        this.fetchMeetingTimes = this.fetchMeetingTimes.bind(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.refreshData.next();
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

    async fetchMeetingTimes() {
        const result = await this.meetingService.getSectionMeetingTimes(this.section);
        this.meetings = result.data;

        return result;
    }
}
