import { Component, Input } from '@angular/core';
import { LessonPlan } from '@dynrec/common';

@Component({
    selector: 'app-lesson-plan-delete',
    templateUrl: './lesson-plan-delete.component.html',
    styleUrls: ['./lesson-plan-delete.component.scss'],
})
export class LessonPlanDeleteComponent {
    @Input() lessonPlan: LessonPlan;

    @Input() isVisible: boolean;
}
