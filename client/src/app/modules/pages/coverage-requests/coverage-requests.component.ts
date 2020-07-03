import { Component, OnInit } from '@angular/core';
import {CourseService} from "@services/course.service";
import {ProblemService} from "@services/problem.service";
import {ActivatedRoute} from "@angular/router";
import {Course} from "@models/course";
import {Problem} from "@models/problem";

@Component({
  selector: 'app-coverage-requests',
  templateUrl: './coverage-requests.component.html',
  styleUrls: ['./coverage-requests.component.scss']
})
export class CoverageRequestsComponent implements OnInit {
  course: Course;
  isLoading: boolean = true;

  constructor( private _courseService: CourseService,
               private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      if (params['courseID']) {
        this.course = await this._courseService.getCourse(params['courseID']);
        this.isLoading = false;
      }
    });
  }

}
