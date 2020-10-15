import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Course } from '@models/course';
import { Section } from '@models/section';
import { CourseService } from '@services/course.service';
import { Subject } from 'rxjs';
import { LoadedArg } from '../../../decorators/input.decorator';

@Component({
    selector: 'app-course-settings',
    templateUrl: './course-settings.component.html',
    styleUrls: ['./course-settings.component.scss'],
})
export class CourseSettingsComponent {
    @LoadedArg(CourseService, Course, 'courseID')
    course: Course;

    sections: Section[];

    isLoading = true;

    tabs: string[] = [
        'Configurations',
        'Roles',
        'Gradebook',
        'Weeks',
        'Learning Goals',
        'Reports',
        'Quizzes',
        'Roster',
    ];

    activeTabIndex = 0;

    activeTabCopy = 0;

    tabToChangeToCopy: number;

    tabToChangeToIndex: number;

    isActiveTabDirty = false;

    isChangesModalVisible = false;

    forceClose: Subject<void> = new Subject<void>();

    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        // TODO - check if active tab is dirty/has changes.
        // If so, then the following will prompt a modal to confirm the tab switch without saving
        // Maybe add an option to save the changes too?
        if (this.isActiveTabDirty) {
            this.tabToChangeToIndex = tabChangeEvent.index;

            if (this.activeTabCopy !== this.tabToChangeToIndex) {
                this.isChangesModalVisible = true;
                this.tabToChangeToCopy = this.tabToChangeToIndex;
            }
            this.activeTabIndex = this.activeTabCopy;
        } else {
            // active tab is not dirty, proceed with changing tab
            this.activeTabIndex = tabChangeEvent.index;
        }
    }

    handleClose(): void {
        this.isChangesModalVisible = false;
        this.activeTabIndex = this.activeTabCopy;
    }

    handleChangesModalAgree(): void {
        // change tab from activeTabIndex to tabToChangeToCopy
        this.activeTabIndex = this.tabToChangeToCopy;
        this.activeTabCopy = this.activeTabIndex;
        this.forceClose.next();
    }
}
