import { Component, Input } from '@angular/core';
import { LessonPlanStep } from '@models/lessonPlanStep';

@Component({
    selector: 'app-lesson-plan-step-view',
    templateUrl: './lesson-plan-step-view.component.html',
    styleUrls: ['./lesson-plan-step-view.component.scss'],
})
export class LessonPlanStepViewComponent {
    @Input() lessonPlanStep: LessonPlanStep;
}
