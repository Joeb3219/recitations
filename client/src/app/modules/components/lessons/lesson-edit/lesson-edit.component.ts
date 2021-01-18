import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, Lesson } from '@dynrec/common';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { LessonService } from '../../../../services/lesson.service';

@Component({
    selector: 'app-lesson-edit',
    templateUrl: './lesson-edit.component.html',
    styleUrls: ['./lesson-edit.component.scss'],
})
export class LessonEditComponent implements OnInit {
    @Input() isVisible: boolean;

    @Input() lesson?: Omit<Lesson, 'id'> & { id: string | undefined };
    @Input() editQuiz: boolean = true;

    @Output() onClose: EventEmitter<void> = new EventEmitter();
    @Output() lessonChange: EventEmitter<Lesson> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    form: Form;

    constructor(private lessonService: LessonService, private toastr: ToastrService) {}

    ngOnInit(): void {
        this.generateForm();
    }

    ngOnChanges(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form();

        if (!this.lesson?.course) {
            return;
        }

        this.form.inputs = [
            {
                type: 'lessonPlan',
                name: 'lessonPlan',
                course: this.lesson?.course,
                value: this.lesson?.lessonPlan,
                label: 'Lesson Plan',
                row: 0,
                col: 0,
            },
            {
                type: 'quiz',
                name: 'quiz',
                course: this.lesson?.course,
                value: this.lesson?.quiz,
                label: 'Quiz',
                hidden: !this.editQuiz,
                row: 1,
                col: 0,
            },
        ];
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(lesson: Lesson): Promise<void> {
        // We apply any fields from the object, and then any from the overwritten data
        // This allows us to submit a new object with the changes between this.lesson and lesson, without
        // having to commit them to the real copy before we've sent to the database
        const updatedLesson = Object.assign({}, this.lesson, lesson);
        try {
            // send state to the db, and obtain back the ground truth that the db produces
            const result = await this.lessonService.upsertLesson(updatedLesson);

            // and now we store the ground truth back in our real object
            Object.assign(this.lesson, result.data);

            this.toastr.success('Successfully edited lesson');
            this.forceClose.next();

            if (this.lesson?.id !== undefined) this.lessonChange.emit(this.lesson as Lesson);
        } catch (err) {
            this.toastr.error('Failed to edit lesson');
        }
    }
}
