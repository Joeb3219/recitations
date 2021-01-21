import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LessonPlan, LessonPlanStep, LessonPlanStepType } from '@dynrec/common';
import { faEllipsisV, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { LessonPlanService } from '../../../../../services/lesson-plan.service';

@Component({
    selector: 'app-lesson-plan-steps-form',
    templateUrl: './lesson-plan-steps-form.component.html',
    styleUrls: ['./lesson-plan-steps-form.component.scss'],
})
export class LessonPlanStepsFormComponent implements OnInit {
    @Input() lessonPlan: LessonPlan;

    @Output() onChange: EventEmitter<LessonPlanStep[]> = new EventEmitter<LessonPlanStep[]>();

    icons = {
        add: faPlusSquare,
        modify: faEllipsisV,
    };

    isEditingStep = false;

    selectedEditedStep?: LessonPlanStep = undefined;

    constructor(private readonly lessonPlanService: LessonPlanService) {}

    ngOnInit(): void {
        if (this.lessonPlan && !this.lessonPlan.steps) {
            this.lessonPlan.steps = [];
        }

        if (this.lessonPlan) this.onChange.emit(this.lessonPlan.steps);
    }

    handleAddNewStep(type: LessonPlanStepType): void {
        this.selectedEditedStep = new LessonPlanStep({
            type,
            course: this.lessonPlan.course,
            creator: this.lessonPlan.creator,
        });
        this.isEditingStep = true;
    }

    handleEditStep(step: LessonPlanStep) {
        this.isEditingStep = true;
        this.selectedEditedStep = step;
    }

    handleEditStepClosed(): void {
        this.isEditingStep = false;
        this.selectedEditedStep = undefined;
        this.onChange.emit(this.lessonPlan.steps);
    }

    handleDeleteStep(step: LessonPlanStep) {
        this.lessonPlan.steps = this.lessonPlan.steps.filter(s => s.id !== step?.id);
        this.onChange.emit(this.lessonPlan.steps);
    }

    handleStepEdited(step: LessonPlanStep): void {
        if (!step) return; // Check that the step was actually returned by the calling form, indicating that a successful step was created

        // Now we check to see if this step already existed in the database
        // if so, we will simply update the list to include this one at the given index
        // we keep track of the found index that the given id already exists at, so that we can overwrite
        // if none is found, the foundIndex will stillb e null, and thus we push instead
        const foundIndex = this.lessonPlan.steps.findIndex(item => item.id === step.id);

        if (foundIndex !== -1) this.lessonPlan.steps[foundIndex] = step;
        else this.lessonPlan.steps.push(step);

        this.handleEditStepClosed();
    }
}
