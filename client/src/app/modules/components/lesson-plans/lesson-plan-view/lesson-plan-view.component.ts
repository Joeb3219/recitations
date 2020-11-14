import { Component, Input } from '@angular/core';
import { LessonPlan } from '@dynrec/common';

@Component({
    selector: 'app-lesson-plan-view',
    templateUrl: './lesson-plan-view.component.html',
    styleUrls: ['./lesson-plan-view.component.scss'],
})
export class LessonPlanViewComponent {
    @Input() lessonPlan: LessonPlan;
}
