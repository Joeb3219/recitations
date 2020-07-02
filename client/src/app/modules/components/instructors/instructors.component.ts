import {Component, Input, OnInit} from '@angular/core';
import {Item} from "@pages/course-settings/course-settings.component";
import {Section} from "@models/section";
import {User} from "@models/user";

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent implements OnInit {

  @Input() sections: Section[];

  rows;
  columns = [{prop: 'sectionNumber', name: 'Section #'}, {prop: 'index', name: "Index #"}, {prop: 'instructor', name: "Instructor"}];

  constructor() {
  }

  ngOnInit() {
    if(this.sections){
      this.rows = this.sections.map(section => ({
        sectionNumber: section.sectionNumber,
        index: section.index,
        instructor: User.getFullName(section.instructor)
      }));
    }
  }

  getFullName(instructor: User) {
    return User.getFullName(instructor);
  }
}
