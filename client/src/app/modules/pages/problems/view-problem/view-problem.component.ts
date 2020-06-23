import {Component, OnInit} from '@angular/core';
import {Problem} from "@models/problem";
import {CourseService} from "@services/course.service";
import {ProblemService} from "@services/problem.service";
import {ActivatedRoute} from "@angular/router";
import {Course} from "@models/course";


@Component({
  selector: 'app-view-problem',
  templateUrl: './view-problem.component.html',
  styleUrls: ['./view-problem.component.scss']
})
export class ViewProblemComponent implements OnInit {

  problem: Problem;
  course: Course;
  isLoading: boolean = true;

  constructor(private _courseService: CourseService,
              private _problemService: ProblemService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      if (params['problemID']) {
        this.course = await this._courseService.getCourse(params['courseID']);
        this.problem = await this._problemService.getProblem(params['problemID']);
        this.isLoading = false;
      }
    });
  }

}
