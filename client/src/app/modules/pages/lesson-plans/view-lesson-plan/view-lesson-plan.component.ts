import { Component } from '@angular/core';
import { LessonPlan } from '@models/lessonPlan';
import { LessonPlanService } from '@services/lesson-plan.service';
import { LoadedArg } from 'src/app/decorators';

@Component({
    selector: 'app-view-lesson-plan',
    templateUrl: './view-lesson-plan.component.html',
    styleUrls: ['./view-lesson-plan.component.scss'],
})
export class ViewLessonPlanComponent {
    @LoadedArg(LessonPlanService, LessonPlan, 'lessonPlanID')
    lessonPlan: LessonPlan;
}
