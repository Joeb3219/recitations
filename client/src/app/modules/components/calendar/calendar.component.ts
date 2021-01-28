import { Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Course, Meeting, MeetingType } from '@dynrec/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeetingService } from '@services/meeting.service';
import { UserService } from '@services/user.service';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import dayjs from 'dayjs';
import _ from 'lodash';
import { AbilityManager } from '../../../../../../common/src/abilities/ability.manager';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

    @Input() course: Course;

    meetings: Meeting<MeetingType>[];

    events: CalendarEvent<{ meeting: Meeting }>[] = [];

    view: CalendarView = CalendarView.Week;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    activeDayIsOpen = true;

    selectedMeeting?: Meeting = undefined;

    canViewAccessCodes: boolean = false;

    constructor(
        private readonly userService: UserService,
        private meetingService: MeetingService,
        private modal: NgbModal
    ) {}

    ngOnInit(): void {
        this.loadMeetings();
        this.userService.getCurrentUser().subscribe({
            next: user => {
                const abilities = AbilityManager.getUserAbilities(user);
                this.canViewAccessCodes = abilities.existsOnCourse('view', 'all-access-codes', this.course);
            },
        });
    }

    getCalendarTitle(meeting: Meeting): string {
        const typeString = _.startCase(meeting.meetingType);
        const date = dayjs(meeting.date).format('MMM DD, YYYY HH:mm');
        return `${typeString}: ${date} ${this.canViewAccessCodes ? `(${meeting.getAccessCode()})` : ``}`;
    }

    async loadMeetings(): Promise<void> {
        const res = await this.meetingService.getMeetingTime(this.course);
        this.meetings = res.data;
        this.events = this.meetings.map(meeting => ({
            title: this.getCalendarTitle(meeting),
            start: new Date(meeting.date),
            meta: { meeting },
        }));
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    handleEvent(action: 'Clicked', event: CalendarEvent<{ meeting: Meeting }>): void {
        this.selectedMeeting = event?.meta?.meeting;
        this.modal.open(this.modalContent, { size: 'lg' });
    }

    setView(view: CalendarView): void {
        this.view = view;
    }

    closeOpenMonthViewDay(): void {
        this.activeDayIsOpen = false;
    }
}
