import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course, CoverageRequest, LearningGoalCategory, Problem, Quiz, Role, Section } from '@dynrec/common';
import { CourseService } from '@services/course.service';
import { UserService } from '@services/user.service';
import { AbilitiesCanDirectivePayload } from '../../../directives/abilities.directive';

type CourseEntry = {
    name: string;
    slug: string;
    can?: AbilitiesCanDirectivePayload;
};

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    userCourses: Course[] = [];

    selectedCourse?: Course = undefined;

    activeSlug?: string;

    courseEntries: { [courseID: string]: CourseEntry[] } = {};

    constructor(private userService: UserService, private courseService: CourseService, private router: Router) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe({
            next: async user => {
                this.userCourses = await this.courseService.getCourses();
                this.loadCourseEntries();
                this.setActiveCourseFromRouter();
            },
        });

        // this router subscription will follow any changes in the current route
        // this will allow for us to determine which course is currently being focused on,
        // which subpiece to highlight, etc.
        // we do this by examining URL changes, and on each change, breaking the URL down into its slugs and
        // comparing those slugs with what we current have stored.
        this.router.events.subscribe({
            next: async event => {
                // ensure this event describes a URL change
                if ('url' in event && event?.url) {
                    this.setActiveCourseFromRouter();
                }
            },
        });
    }

    loadCourseEntries() {
        this.userCourses?.forEach(course => {
            this.courseEntries[course.id] = [
                {
                    slug: '',
                    name: 'Home',
                },
                {
                    slug: 'recitations',
                    name: 'Recitations',
                    can: { action: 'view', subject: 'recitation', existsOnCourse: course },
                },
                {
                    slug: 'sections',
                    name: 'Sections',
                    can: { action: 'view', subject: Section, existsOnCourse: course },
                },
                {
                    slug: 'problems',
                    name: 'Problems',
                    can: { action: 'view', subject: Problem, existsOnCourse: course },
                },
                {
                    slug: 'lesson-plans',
                    name: 'Lesson Plans',
                    can: { action: 'view', subject: 'lesson-plan-sidebar', existsOnCourse: course },
                },
                {
                    slug: 'learning-goals',
                    name: 'Learning Goals',
                    can: { action: 'update', subject: LearningGoalCategory, existsOnCourse: course },
                },
                {
                    slug: 'coverage-requests',
                    name: 'Coverage Requests',
                    can: { action: 'view', subject: CoverageRequest, existsOnCourse: course },
                },
                {
                    slug: 'coverage-requests/monitor',
                    name: 'Coverage Monitor',
                    can: { action: 'use', subject: 'coverage-request-monitor', existsOnCourse: course },
                },
                {
                    slug: 'settings',
                    name: 'Settings',
                    can: { action: 'update', subject: Course, existsOnCourse: course },
                },
                {
                    slug: 'my-gradebook',
                    name: 'Gradebook',
                    can: { action: 'view', subject: 'gradebook', existsOnCourse: course },
                },
                {
                    slug: 'reports',
                    name: 'Reports',
                    can: { action: 'view', subject: 'reports', existsOnCourse: course },
                },
                {
                    slug: 'roles',
                    name: 'Roles',
                    can: { action: 'view', subject: Role, existsOnCourse: course },
                },
                {
                    slug: 'quizzes',
                    name: 'Quizzes',
                    can: { action: 'view', subject: Quiz, existsOnCourse: course },
                },
            ];
        });
    }

    // this function will check what's going on in the router,
    // and attempt to set the active course in the sidebar depending on what the loaded course is
    setActiveCourseFromRouter(): void {
        const url = this.router.url;
        this.userCourses.forEach(course => {
            // this slug is the prefix to the URL that would indicate that this course is
            // currently active/being worked in.
            const slug = `/courses/${course.id}`;
            if (url.indexOf(slug) === 0) {
                this.selectedCourse = course;
                this.setStep(this.userCourses.indexOf(this.selectedCourse));
            }
        });
        this.setActiveNavLinkFromRouter();
    }

    setActiveNavLinkFromRouter(): void {
        const url = this.router.url;
        if (this.selectedCourse) {
            const slug = `/courses/${this.selectedCourse.id}`;

            // cut off the base url to see what page the user is on
            let page = url.substr(slug.length + 1);

            // if the route contains anything after the active page, chop it off
            if (page.indexOf('/') !== -1) {
                page = page.substr(0, page.indexOf('/'));
            }

            this.activeSlug = page;
        }
    }

    step = 0;

    setStep(index: number): void {
        this.step = index;
    }
}
