import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Form } from '@models/forms/form';
import { LessonPlan } from '@models/lessonPlan';
import { LessonPlanStep } from '@models/lessonPlanStep';

@Component({
  selector: 'app-lesson-plan-steps-edit',
  templateUrl: './lesson-plan-steps-edit.component.html',
  styleUrls: ['./lesson-plan-steps-edit.component.scss']
})
export class LessonPlanStepsEditComponent implements OnInit {

	@Input() isVisible: boolean
	@Input() lessonPlanStep: LessonPlanStep
	@Output() onClose: EventEmitter<{}> = new EventEmitter();
	@Output() onLessonPlanStepEdited: EventEmitter<LessonPlanStep> = new EventEmitter();
	forceClose: Subject<any> = new Subject<any>()
	form: Form

  constructor() { }

  ngOnInit() {
  }

}
