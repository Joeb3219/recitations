import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faPlusSquare, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import { LessonPlanStep, LessonPlanStepType } from '@models/lessonPlanStep';
import { LessonPlan } from '@models/lessonPlan';

@Component({
  selector: 'app-lesson-plan-steps-form',
  templateUrl: './lesson-plan-steps-form.component.html',
  styleUrls: ['./lesson-plan-steps-form.component.scss']
})
export class LessonPlanStepsFormComponent implements OnInit {

  @Input() lessonPlan: LessonPlan;
  @Output() onChange: EventEmitter<LessonPlanStep[]> = new EventEmitter<LessonPlanStep[]>();

  icons = {
		add: faPlusSquare,
		modify: faEllipsisV,
  }
  
	isEditingStep: boolean = false;
	selectedEditedStep: LessonPlanStep = null

  constructor() { }

	ngOnInit() {
		if(this.lessonPlan && !this.lessonPlan.steps){
			this.lessonPlan.steps = []
		}

		if(this.lessonPlan) this.onChange.emit(this.lessonPlan.steps)
	}

	handleAddNewStep(type: LessonPlanStepType) {
		this.selectedEditedStep = new LessonPlanStep({ type, course: this.lessonPlan.course, creator: this.lessonPlan.creator });
		this.isEditingStep = true
	}

	handleEditStepClosed() {
		this.isEditingStep = false
		this.selectedEditedStep = null
		this.onChange.emit(this.lessonPlan.steps)
	}

	handleStepEdited(step: LessonPlanStep) {
		if(!step) return; // Check that the step was actually returned by the calling form, indicating that a successful step was created

		// Now we check to see if this step already existed in the database
		// if so, we will simply update the list to include this one at the given index
		// we keep track of the found index that the given id already exists at, so that we can overwrite
		// if none is found, the foundIndex will stillb e null, and thus we push instead
		let foundIndex = null
		this.lessonPlan.steps.forEach((item, index) => {
			if(item.id == step.id) foundIndex = index
		})

		if(foundIndex) this.lessonPlan.steps[foundIndex] = step
		else this.lessonPlan.steps.push(step)

		console.log(step, foundIndex);

		this.handleEditStepClosed()
	}

}
