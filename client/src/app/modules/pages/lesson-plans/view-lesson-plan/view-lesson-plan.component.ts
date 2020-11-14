import { Component } from '@angular/core';
import { LessonPlan } from '@dynrec/common';
import { LessonPlanService } from '@services/lesson-plan.service';
import { LoadedArg } from '../../../../decorators';

@Component({
    selector: 'app-view-lesson-plan',
    templateUrl: './view-lesson-plan.component.html',
    styleUrls: ['./view-lesson-plan.component.scss'],
})
export class ViewLessonPlanComponent {
    @LoadedArg(LessonPlanService, LessonPlan, 'lessonPlanID')
    lessonPlan: LessonPlan;
}
