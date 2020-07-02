import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Section} from "@models/section";
import {Item} from "@pages/course-settings/course-settings.component";
import {User} from "@models/user";

@Component({
  selector: 'app-las',
  templateUrl: './las.component.html',
  styleUrls: ['./las.component.scss']
})
export class LasComponent implements OnInit {

  @Input() sections: Section[];

  rows: Array<any>;
  columns: Array<any> = [
    {
      prop: 'sectionNumber',
      name: 'Section #'
    },
    {
      prop: 'index',
      name: "Index #"
    },
    {
      prop: 'ta',
      name: "LA"
    },
    {
      prop: 'id',
      name: 'Actions',
      actions: ["modify", "delete", "view"]
    }
  ];

  constructor() {
  }

  ngOnInit() {
    if (this.sections) {
      this.rows = this.sections.map(section => ({
        sectionNumber: section.sectionNumber,
        index: section.index,
        ta: User.getFullName(section.ta),
        id: section.id
      }));
    }
  }

  getFullName(instructor: User) {
    return User.getFullName(instructor);
  }

}
