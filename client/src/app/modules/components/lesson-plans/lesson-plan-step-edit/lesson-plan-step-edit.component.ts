import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, FormFieldUpdated, LessonPlanStep } from '@dynrec/common';
import { LessonPlanService } from '@services/lesson-plan.service';
import { get } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-lesson-plan-step-edit',
    templateUrl: './lesson-plan-step-edit.component.html',
    styleUrls: ['./lesson-plan-step-edit.component.scss'],
})
export class LessonPlanStepEditComponent implements OnInit {
    @Input() isVisible = true;

    @Input() lessonPlanStep: LessonPlanStep;

    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

    @Output() onStepEdited: EventEmitter<LessonPlanStep> = new EventEmitter<LessonPlanStep>();

    form: Form;

    forceClose: Subject<void> = new Subject<void>();

    constructor(private lessonPlanService: LessonPlanService, private toastr: ToastrService) {}

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
                type: 'select',
                name: 'type',
                options: [
                    { value: 'task', label: 'Task' },
                    { value: 'problem', label: 'Problem' },
                ],
                value: get(this.lessonPlanStep, 'type'),
                label: 'Step Type',
                row: 0,
                col: 0,
            },
            {
                type: 'number',
                name: 'estimatedDuration',
                label: 'Estimated Duration',
                disabled: get(this.lessonPlanStep, 'type') === 'problem',
                value: get(this.lessonPlanStep, 'problem')
                    ? get(this.lessonPlanStep, 'problem.estimatedDuration')
                    : get(this.lessonPlanStep, 'estimatedDuration'),
                row: 0,
                col: 1,
            },
            {
                type: 'text',
                name: 'title',
                label: 'Title',
                value: get(this.lessonPlanStep, 'title'),
                row: 1,
                col: 0,
            },
            {
                type: 'text',
                name: 'description',
                label: 'Description',
                value: get(this.lessonPlanStep, 'description'),
                row: 2,
            },
            {
                type: 'problem',
                name: 'problem',
                label: 'Problem',
                course: get(this.lessonPlanStep, 'course'),
                value: get(this.lessonPlanStep, 'problem'),
                hidden: get(this.lessonPlanStep, 'type') !== 'problem',
                row: 3,
            },
        ];
    }

    handleFieldChange({ name, value }: FormFieldUpdated): void {
        Object.assign(this.lessonPlanService, { [name]: value });
        this.generateForm();
    }

    handleClose(): void {
        this.onClose.emit();
    }

    async formSubmitted(data: LessonPlanStep): Promise<void> {
        // first we update the data in the model
        Object.assign(this.lessonPlanStep, data);

        // and now we submit it to the API.
        try {
            const result = await (await this.lessonPlanService.upsertLessonPlanStep(this.lessonPlanStep)).data;
            this.onStepEdited.emit(result);

            this.toastr.success('Successfully created lesson plan step');
            this.forceClose.next();
        } catch (err) {
            this.toastr.error('Failed to create lesson plan step');
        }
    }
}
