import {Component, OnInit} from '@angular/core';
import {CourseService} from "@services/course.service";
import {ActivatedRoute} from "@angular/router";
import {Course} from "@models/course";
import { LessonPlan } from '@models/lessonPlan';
import { LessonPlanService } from '@services/lesson-plan.service';

@Component({
  selector: 'app-view-lesson-plan',
  templateUrl: './view-lesson-plan.component.html',
  styleUrls: ['./view-lesson-plan.component.scss']
})
export class ViewLessonPlanComponent implements OnInit {

  lessonPlan: LessonPlan;
  course: Course;
  isLoading: boolean = true;

  constructor(private _courseService: CourseService,
              private _lessonPlanService: LessonPlanService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      console.log(params);
      if (params['lessonPlanID']) {
        this.course = await this._courseService.getCourse(params['courseID']);
        this.lessonPlan = await this._lessonPlanService.getLessonPlan(params['lessonPlanID']);
        this.isLoading = false;
      }
    });
  }
}