import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '@pages/login/login.component'
import { ViewCourseComponent } from '@pages/courses/view-course/view-course.component'
import { ViewSectionsComponent } from '@pages/sections/view-sections/view-sections.component'
import { ListProblemsComponent } from '@pages/problems/list-problems/list-problems.component'
import { ViewProblemComponent } from "@pages/problems/view-problem/view-problem.component";
import { CourseSettingsComponent } from "@pages/course-settings/course-settings.component";
import { CoverageRequestsComponent } from "@pages/coverage-requests/coverage-requests.component";
import { RecitationsComponent } from "@pages/recitations/recitations.component";
import { ListLessonPlansComponent } from "@pages/lesson-plans/list-lesson-plans/list-lesson-plans.component";

const routes: Routes = [

	{ path: 'login', component: LoginComponent },

	{ path: 'courses/:courseID', component: ViewCourseComponent },
	{ path: 'courses/:courseID/sections', component: ViewSectionsComponent },
	{ path: 'courses/:courseID/problems', component: ListProblemsComponent },
  { path: 'courses/:courseID/problems/:problemID', component: ViewProblemComponent },
  { path: 'courses/:courseID/settings', component: CourseSettingsComponent },
  { path: 'courses/:courseID/coverage-requests', component: CoverageRequestsComponent },
  { path: 'courses/:courseID/recitations', component: RecitationsComponent },
  { path: 'courses/:courseID/lesson-plans', component: ListLessonPlansComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
