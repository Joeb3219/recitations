import { Component, Input, OnInit } from '@angular/core';
import { Course, Lesson } from '@dynrec/common';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { LessonService } from '../../../services/lesson.service';

@Component({
    selector: 'app-weeks',
    templateUrl: './weeks.component.html',
    styleUrls: ['./weeks.component.scss'],
})
export class WeeksComponent implements OnInit {
    @Input() course: Course;

    weeks?: (Lesson | undefined)[];
    weekBeginDates?: Date[];
    weekLabels?: string[];

    selectedIndex: number = -1;
    selectedLesson?: Lesson;
    isEditLessonModalOpen: boolean = false;
    sampleLesson: Lesson = new Lesson();

    constructor(private readonly lessonService: LessonService, private readonly toastr: ToastrService) {}

    ngOnInit() {
        this.sampleLesson = new Lesson({ course: this.course, meetingTime: null });
        this.loadLessons();
    }

    async loadLessons() {
        const lessons = await this.lessonService.getCourseLessons(this.course);
        const defaultLessons = lessons.data.filter(lesson => !lesson.meetingTime);

        // Now that we have the default lessons, we must make an array of all of the dates
        const startDate = dayjs
            .tz(this.course.getSetting('semester_start_date').value ?? '', 'America/New_York')
            .startOf('week')
            .startOf('day')
            .add(1, 'day');

        const endDate = dayjs
            .tz(this.course.getSetting('semester_end_date').value ?? '', 'America/New_York')
            .endOf('week')
            .endOf('day');
        let currentDate = startDate.clone();

        const validDates: Date[] = [];
        while (currentDate.isBefore(endDate)) {
            validDates.push(currentDate.toDate());
            currentDate = currentDate.add(7, 'day');
        }

        this.weekLabels = [];
        this.weekBeginDates = [];

        this.weeks = validDates.map(date => {
            const dayjsDate = dayjs(date);
            const found = defaultLessons.find(lesson => dayjsDate.isSame(dayjs(lesson.beginDate), 'day'));

            this.weekLabels?.push(
                `${dayjsDate.add(1, 'day').format('MM/DD')} - ${dayjsDate.add(6, 'day').format('MM/DD/YYYY')}`
            );

            this.weekBeginDates?.push(date);

            return found;
        });
    }

    handleEditLesson(idx: number) {
        if (idx >= (this.weeks?.length ?? 0)) {
            return;
        }

        if (this.weeks && !this.weeks[idx]) {
            const beginDate = dayjs(this.weekBeginDates?.[idx]);
            this.weeks[idx] = new Lesson({
                course: this.course,
                beginDate: beginDate.toDate(),
                endDate: beginDate.add(1, 'day').endOf('week').endOf('day').toDate(),
            });

            this.selectedIndex = idx;
            this.selectedLesson = this.weeks[idx];
            this.isEditLessonModalOpen = true;
        } else {
            this.isEditLessonModalOpen = true;
            this.selectedLesson = this.weeks?.[idx];
        }
    }

    handleCloseEditLessonModal() {
        if (this.weeks?.[this.selectedIndex]) {
            this.weeks[this.selectedIndex] = this.selectedLesson?.id ? this.selectedLesson : undefined;
        }

        this.selectedIndex = -1;
        this.selectedLesson = undefined;
        this.isEditLessonModalOpen = false;
    }

    handleDeleteLesson(idx: number) {
        if (idx >= (this.weeks?.length ?? 0)) {
            return;
        }

        if (this.weeks?.[idx] && this.weeks[idx]?.id) {
            const lesson = this.weeks[idx];
            if (!lesson) {
                return;
            }
            try {
                this.lessonService.deleteLesson(lesson.id);
                this.weeks[idx] = undefined;
                this.toastr.success('Successfully deleted lesson.');
            } catch (err) {
                this.toastr.error('Failed to delete lesson.');
            }
        }
    }
}
