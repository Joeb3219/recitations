import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form } from '@models/forms/form';
import { LessonPlan } from '@models/lessonPlan';
import { LessonPlanService } from '@services/lesson-plan.service';
import { get } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-lesson-plan-edit',
    templateUrl: './lesson-plan-edit.component.html',
    styleUrls: ['./lesson-plan-edit.component.scss'],
})
export class LessonPlanEditComponent implements OnInit {
    @Input() lessonPlan: LessonPlan;

    @Input() isVisible: boolean;

    @Output() onClose: EventEmitter<void> = new EventEmitter();

    forceClose: Subject<void> = new Subject<void>();

    form: Form;

    constructor(
        private lessonPlanService: LessonPlanService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.generateForm();
    }

    ngOnChanges(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.form = new Form();
        this.form.inputs = [
            {
                type: 'text',
                name: 'name',
                value: get(this, 'lessonPlan.name'),
                label: 'Name',
                row: 0,
                col: 0,
            },
            {
                type: 'select',
                name: 'difficulty',
                options: [
                    { label: 'Easy', value: '1' },
                    { label: 'Medium', value: '3' },
                    { label: 'Hard', value: '5' },
                ],
                value: get(this, 'lessonPlan.difficulty'),
                label: 'Difficulty',
                row: 0,
                col: 1,
            },
            {
                type: 'lessonPlanSteps',
                name: 'lessonPlanSteps',
                lessonPlan: get(this, 'lessonPlan'),
                label: 'Steps',
                row: 1,
                col: 0,
            },
        ];
    }

    handleClose(): void {
        this.onClose.emit(null);
    }

    async formSubmitted(lessonPlan: LessonPlan): Promise<void> {
        // We apply any fields from the object, and then any from the overwritten data
        // This allows us to submit a new object with the changes between this.lessonPlan and lessonPlan, without
        // having to commit them to the real copy before we've sent to the database
        const updatedLessonPlan = Object.assign(
            {},
            this.lessonPlan,
            lessonPlan
        );
        try {
            // send state to the db, and obtain back the ground truth that the db produces
            const result = await (
                await this.lessonPlanService.upsertLessonPlan(updatedLessonPlan)
            ).data;

            // and now we store the ground truth back in our real object
            Object.assign(this.lessonPlan, result);

            this.toastr.success('Successfully edited lesson plan');
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to edit lesson plan');
        }
    }
}
