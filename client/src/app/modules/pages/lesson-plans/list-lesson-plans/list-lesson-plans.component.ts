import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

import {CourseService} from '@services/course.service';
import { LessonPlanService } from '@services/lesson-plan.service';

import { Course } from '@models/course'
import { LessonPlan } from '@models/lessonPlan'

@Component({
  selector: 'app-list-lesson-plans',
  templateUrl: './list-lesson-plans.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./list-lesson-plans.component.scss']
})
export class ListLessonPlansComponent implements OnInit {
  course: Course;
  lessonPlans: LessonPlan[];
  isLoading: boolean = true;

  selectedLessonPlan: LessonPlan = null;
  isEditLessonPlanModalOpen: boolean = false;
  isDeleteLessonPlanModalOpen: boolean = false;

  constructor(
    private _courseService: CourseService,
    private _lessonPlanService: LessonPlanService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      if (params['courseID']) {
        this.course = await this._courseService.getCourse(params['courseID'])
        this.lessonPlans = await this._lessonPlanService.getCourseLessonPlans(this.course)
        this.isLoading = false
      }
    });
  }

  handleOpenNewLessonPlanModal() {
    this.isEditLessonPlanModalOpen = true

    this.selectedLessonPlan = new LessonPlan()
    this.selectedLessonPlan.course = this.course;
  }

  handleCloseEditLessonPlanModal() {
    this.isEditLessonPlanModalOpen = false

    // And now we add the lesson plan if needed
    // We perform a search for if there is a lesson plan with that id already
    const foundLessonPlan = this.lessonPlans.find((lp) => {
      if (lp.id == this.selectedLessonPlan.id) return true
    })

    // if the lesson plan was found, we already have it in our array, and the data would be updated via the component
    // if it wasn't found, we insert it new.
    if (!foundLessonPlan) this.lessonPlans.push(this.selectedLessonPlan)

    this.selectedLessonPlan = null;
  }

  handleOpenEditLessonPlanModal(lessonPlan: LessonPlan) {
    this.isEditLessonPlanModalOpen = true;
    this.selectedLessonPlan = lessonPlan
  }

  handleOpenDeleteLessonPlanModal(lessonPlan: LessonPlan) {
    this.isDeleteLessonPlanModalOpen=true;
    this.selectedLessonPlan = lessonPlan;
  }

  handleCloseDeleteLessonPlanModal($event){
    this.isDeleteLessonPlanModalOpen=false;

    if($event){
      this.lessonPlans.splice(this.lessonPlans.indexOf(this.selectedLessonPlan), 1);
    }

  }
}
