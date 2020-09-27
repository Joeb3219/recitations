import { Component, OnInit, Input } from '@angular/core';

import { LessonPlan } from '@models/lessonPlan';

@Component({
  selector: 'app-lesson-plan-delete',
  templateUrl: './lesson-plan-delete.component.html',
  styleUrls: ['./lesson-plan-delete.component.scss']
})
export class LessonPlanDeleteComponent implements OnInit {

  @Input() lessonPlan: LessonPlan;
  @Input() isVisible: boolean;

  constructor() { }

  ngOnInit() {
  }

}
