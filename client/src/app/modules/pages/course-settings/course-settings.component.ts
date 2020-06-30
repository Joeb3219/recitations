import {Component, OnInit} from '@angular/core';
import {CourseService} from "@services/course.service";
import {ProblemService} from "@services/problem.service";
import {ActivatedRoute} from "@angular/router";
import {Course} from "@models/course";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Subject} from "rxjs";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-course-settings',
  templateUrl: './course-settings.component.html',
  styleUrls: ['./course-settings.component.scss']
})
export class CourseSettingsComponent implements OnInit {

  course: Course;
  isLoading: boolean = true;
  tabs = ["Configurations","Roles", "Gradebook", "Weeks", "LAs", "Instructors", "Learning Goals", "Reports", "Quizzes", "Roster"];

  activeTabIndex: number = 0;
  activeTabCopy: number = 0;

  tabToChangeToCopy: number;
  tabToChangeToIndex: number;

  isActiveTabDirty: boolean = false;

  isChangesModalVisible: boolean = false;
  forceClose: Subject<any> = new Subject<any>();

  constructor(private _courseService: CourseService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      if (params['courseID']) {
        this.course = await this._courseService.getCourse(params['courseID']);
        this.isLoading = false;
      }
    });
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    //TODO - check if active tab is dirty/has changes.
    // If so, then the following will prompt a modal to confirm the tab switch without saving
    // Maybe add an option to save the changes too?
    if (this.isActiveTabDirty) {
      this.tabToChangeToIndex = tabChangeEvent.index;

      if (this.activeTabCopy != this.tabToChangeToIndex) {
        this.isChangesModalVisible = true;
        this.tabToChangeToCopy = this.tabToChangeToIndex;
      }
      this.activeTabIndex = this.activeTabCopy;
    } else { //active tab is not dirty, proceed with changing tab
      this.activeTabIndex = tabChangeEvent.index;
    }
  }


  handleClose() {
    this.isChangesModalVisible = false;
    this.activeTabIndex = this.activeTabCopy;
  }

  handleChangesModalAgree() {
    //change tab from activeTabIndex to tabToChangeToCopy
    this.activeTabIndex = this.tabToChangeToCopy;
    this.activeTabCopy = this.activeTabIndex;
    this.forceClose.next();
  }


}
