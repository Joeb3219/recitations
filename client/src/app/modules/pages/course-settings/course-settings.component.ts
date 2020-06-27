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
  tabs = ["Configurations", "Gradebook", "Weeks", "LAs", "Instructors", "Learning Goals", "Reports", "Quizzes"];
  activeTabIndex: number = 0;
  activeTabCopy: number = 0;
  tabToChangeToCopy: number;
  tabToChangeToIndex: number;

  isActiveTabDirty: boolean = false;

  // activeTabIndex = new FormControl(0);
  // activeTabCopy = new FormControl(0);

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
    // console.log('tabChangeEvent => ', tabChangeEvent);
    // console.log('index => ', tabChangeEvent.index);

    //TODO - check if active tab is dirty/has changes.
    // If so, then the following will prompt a modal to confirm the tab switch without saving
    // Maybe add an option to save the changes too?
    if (this.isActiveTabDirty) {
      this.tabToChangeToIndex = tabChangeEvent.index;
      console.log("current tab: " + this.tabs[this.activeTabCopy]);
      console.log("tab to go to is: " + this.tabs[this.tabToChangeToIndex]);

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
    console.log("agree change tab");
    console.log("changing from " + this.tabs[this.activeTabIndex] + " to " + this.tabs[this.tabToChangeToCopy]);
    this.activeTabIndex = this.tabToChangeToCopy;
    this.activeTabCopy = this.activeTabIndex;
    this.forceClose.next();
  }

}
