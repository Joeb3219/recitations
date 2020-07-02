import {Component, Injectable, Injector, OnInit, ReflectiveInjector} from '@angular/core';
import {CourseService} from "@services/course.service";
import {ProblemService} from "@services/problem.service";
import {ActivatedRoute} from "@angular/router";
import {Course} from "@models/course";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Subject} from "rxjs";
import {FormControl} from "@angular/forms";
import {ConfigurationsComponent} from "@components/configurations/configurations.component";
import {RolesComponent} from "@components/roles/roles.component";
import {GradebookComponent} from "@components/gradebook/gradebook.component";
import {WeeksComponent} from "@components/weeks/weeks.component";
import {LasComponent} from "@components/las/las.component";
import {InstructorsComponent} from "@components/instructors/instructors.component";
import {LearningGoalsComponent} from "@components/learning-goals/learning-goals.component";
import {ReportsComponent} from "@components/reports/reports.component";
import {QuizzesComponent} from "@components/quizzes/quizzes.component";
import {RosterComponent} from "@components/roster/roster.component";
import {User} from "@models/user";
import {Section} from "@models/section";
import {SectionService} from "@services/section.service";

@Injectable({
  providedIn: 'root',
})
export class Item {
  public content: any;

  constructor(content) {
    this.content = content;
  }
}

@Component({
  selector: 'app-course-settings',
  templateUrl: './course-settings.component.html',
  styleUrls: ['./course-settings.component.scss']
})
export class CourseSettingsComponent implements OnInit {

  course: Course;
  sections: Section[];
  isLoading: boolean = true;
  tabs: Array<any>;

  activeTabIndex: number = 0;
  activeTabCopy: number = 0;

  tabToChangeToCopy: number;
  tabToChangeToIndex: number;

  isActiveTabDirty: boolean = false;

  isChangesModalVisible: boolean = false;
  forceClose: Subject<any> = new Subject<any>();

  constructor(private _courseService: CourseService, private _sectionService: SectionService,
              private route: ActivatedRoute, private inj: Injector) {
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      if (params['courseID']) {
        this.course = await this._courseService.getCourse(params['courseID']);
        this.sections = await this._sectionService.getCourseSections(this.course);

        this.tabs = ["Configurations", "Roles", "Gradebook", "Weeks", "LAs", "Instructors", "Learning Goals", "Reports", "Quizzes", "Roster"];
        // this.tabs = [
        //   {
        //     name: "Configurations",
        //     component: ConfigurationsComponent
        //   },
        //   {
        //     name: "Roles",
        //     component: RolesComponent
        //   },
        //   {
        //     name: "Gradebook",
        //     component: GradebookComponent
        //   },
        //   {
        //     name: "Weeks",
        //     component: WeeksComponent
        //   },
        //   {
        //     name: "LAs",
        //     component: LasComponent
        //   },
        //   {
        //     name: "Instructors",
        //     component: InstructorsComponent
        //   },
        //   {
        //     name: "Learning Goals",
        //     component: LearningGoalsComponent
        //   },
        //   {
        //     name: "Reports",
        //     component: ReportsComponent
        //   },
        //   {
        //     name: "Quizzes",
        //     component: QuizzesComponent
        //   },
        //   {
        //     name: "Roster",
        //     component: RosterComponent
        //   }];

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


  createInjector(tab: any) {

  }
}
