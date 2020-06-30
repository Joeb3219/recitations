import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CourseService} from "@services/course.service";
import {Course} from "@models/course";

@Component({
  selector: 'app-recitations',
  templateUrl: './recitations.component.html',
  styleUrls: ['./recitations.component.scss']
})
export class RecitationsComponent implements OnInit {
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
